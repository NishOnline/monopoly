"""
Richup.io 1-1 Clone Server
High-performance aiohttp WebSocket & HTTP Server
"""

import asyncio
import json
import logging
import os
import random
import re
import time
import uuid
from typing import Dict, Set
from aiohttp import web, WSMsgType

from game.engine import GameRoom, AVATARS, COLORS
from game.bot_ai import BotAI, BOT_NAMES

def is_valid_avatar(avatar):
    if not isinstance(avatar, str):
        return False
    avatar = avatar.strip()
    return 1 <= len(avatar) <= 12
from game.board_data import BOARD_TILES, COLOR_GROUPS, MAPS

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

rooms: Dict[str, GameRoom] = {}
room_bots: Dict[str, BotAI] = {}
# room_id -> set of connected websocket connections
room_sockets: Dict[str, Set[web.WebSocketResponse]] = {}
# socket -> {"room_id": str, "player_id": str}
socket_meta: Dict[web.WebSocketResponse, Dict[str, str]] = {}


def generate_room_code() -> str:
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    while True:
        code = "".join(random.choice(chars) for _ in range(5))
        if code not in rooms:
            return code


async def broadcast_room(room_id: str):
    room = rooms.get(room_id)
    if not room:
        return
    sockets = room_sockets.get(room_id, set())
    if not sockets:
        return

    payload = json.dumps({
        "type": "GAME_STATE",
        "data": room.serialize()
    })

    closed = set()
    for ws in list(sockets):
        try:
            if not ws.closed:
                await ws.send_str(payload)
            else:
                closed.add(ws)
        except Exception:
            closed.add(ws)

    for c in closed:
        sockets.discard(c)


def check_and_cleanup_room(rid: str) -> bool:
    """Deletes room if there are 0 real players or 0 players total."""
    room = rooms.get(rid)
    if not room:
        return True
    has_waiting = any(
        not p.get("is_bot") and not p.get("is_bankrupt") and p.get("disconnect_deadline") and time.time() < p["disconnect_deadline"]
        for p in room.players.values()
    )
    real_count = sum(1 for p in room.players.values() if not p.get("is_bot") and p.get("connected", True))
    total_count = len(room.players)
    if (real_count == 0 and not has_waiting) or total_count == 0:
        rooms.pop(rid, None)
        room_bots.pop(rid, None)
        room_sockets.pop(rid, None)
        logging.info(f"Room {rid} deleted (no real players remaining).")
        return True
    return False


async def handle_ws(request):
    ws = web.WebSocketResponse(heartbeat=15.0)
    await ws.prepare(request)

    current_room_id = None
    current_player_id = None

    try:
        async for msg in ws:
            if msg.type == WSMsgType.TEXT:
                try:
                    data = json.loads(msg.data)
                except Exception:
                    continue

                action = data.get("action")

                if action == "CREATE_ROOM":
                    player_name = data.get("playerName", "Player").strip() or "Player"
                    is_public = bool(data.get("is_public", False))
                    room_id = generate_room_code()
                    player_id = str(uuid.uuid4())[:8]

                    room = GameRoom(room_id, player_id, player_name, is_public=is_public)
                    if data.get("avatar") and is_valid_avatar(data["avatar"]):
                        room.players[player_id]["avatar"] = data["avatar"].strip()[:12]
                    if data.get("color") and data["color"] in COLORS:
                        room.players[player_id]["color"] = data["color"]

                    rooms[room_id] = room
                    room_bots[room_id] = BotAI(room)
                    room_sockets[room_id] = {ws}

                    current_room_id = room_id
                    current_player_id = player_id
                    socket_meta[ws] = {"room_id": room_id, "player_id": player_id}

                    await ws.send_str(json.dumps({
                        "type": "JOINED_SUCCESS",
                        "roomId": room_id,
                        "playerId": player_id,
                        "isHost": True
                    }))
                    await broadcast_room(room_id)

                elif action == "JOIN_ROOM":
                    room_id = data.get("roomId", "").strip().upper()
                    player_name = data.get("playerName", "Player").strip() or "Player"
                    existing_id = data.get("playerId")

                    room = rooms.get(room_id)
                    if not room:
                        await ws.send_str(json.dumps({
                            "type": "ERROR",
                            "message": f"Room '{room_id}' not found."
                        }))
                        continue

                    # Check if reconnecting
                    if existing_id and existing_id in room.players:
                        player_id = existing_id
                        p = room.players[player_id]
                        p["connected"] = True
                        p["disconnect_deadline"] = None
                        p["name"] = player_name
                        if data.get("avatar") and is_valid_avatar(data["avatar"]):
                            p["avatar"] = data["avatar"].strip()[:12]
                        if data.get("color"):
                            p["color"] = data["color"]
                        room.log(f"{p['name']} reconnected to the game! ⚡", "info", "🔌", player_id)
                    else:
                        if room.state != "LOBBY":
                            # Game already in progress: join as live spectator!
                            player_id = "spec_" + str(uuid.uuid4())[:6]
                            current_room_id = room_id
                            current_player_id = player_id
                            socket_meta[ws] = {"room_id": room_id, "player_id": player_id, "is_spectator": True}
                            if room_id not in room_sockets:
                                room_sockets[room_id] = set()
                            room_sockets[room_id].add(ws)

                            room.log(f"{player_name} joined as a spectator.", "lobby", "👁️")
                            await ws.send_str(json.dumps({
                                "type": "JOINED_SUCCESS",
                                "roomId": room_id,
                                "playerId": player_id,
                                "isHost": False,
                                "isSpectator": True
                            }))
                            await broadcast_room(room_id)
                            continue

                        player_id = str(uuid.uuid4())[:8]
                        res = room.add_player(player_id, player_name)
                        if not res:
                            await ws.send_str(json.dumps({
                                "type": "ERROR",
                                "message": "Room is full."
                            }))
                            continue
                        if data.get("avatar") and is_valid_avatar(data["avatar"]):
                            room.players[player_id]["avatar"] = data["avatar"].strip()[:12]
                        if data.get("color"):
                            req_color = data["color"]
                            used_colors = {p["color"] for pid, p in room.players.items() if pid != player_id}
                            if req_color in COLORS and req_color not in used_colors:
                                room.players[player_id]["color"] = req_color
                            # If taken or invalid, add_player already assigned a unique available color

                    current_room_id = room_id
                    current_player_id = player_id
                    socket_meta[ws] = {"room_id": room_id, "player_id": player_id}
                    if room_id not in room_sockets:
                        room_sockets[room_id] = set()
                    room_sockets[room_id].add(ws)

                    await ws.send_str(json.dumps({
                        "type": "JOINED_SUCCESS",
                        "roomId": room_id,
                        "playerId": player_id,
                        "isHost": (player_id == room.host_id)
                    }))
                    await broadcast_room(room_id)

                # Room actions
                if not current_room_id or not current_player_id:
                    continue
                room = rooms.get(current_room_id)
                if not room:
                    continue

                if action == "UPDATE_PROFILE":
                    p = room.players.get(current_player_id)
                    if p:
                        if "color" in data:
                            req_color = data["color"]
                            used_colors = {other["color"] for pid, other in room.players.items() if pid != current_player_id}
                            if req_color in used_colors:
                                await ws.send_str(json.dumps({
                                    "type": "ACTION_ERROR",
                                    "title": "Color Taken",
                                    "message": "That color is already taken by another player in this room. Please choose a different color."
                                }))
                            elif req_color in COLORS:
                                p["color"] = req_color
                        if "avatar" in data and is_valid_avatar(data["avatar"]):
                            p["avatar"] = data["avatar"].strip()[:12]
                        if "ready" in data:
                            p["ready"] = bool(data["ready"])
                        await broadcast_room(current_room_id)

                elif action == "UPDATE_SETTINGS":
                    if current_player_id == room.host_id and room.state == "LOBBY":
                        room.update_settings(data.get("settings", {}))
                        await broadcast_room(current_room_id)

                elif action == "ADD_BOT":
                    if current_player_id == room.host_id and room.state == "LOBBY":
                        if len(room.players) < room.settings["max_players"]:
                            bot_id = "bot_" + str(uuid.uuid4())[:6]
                            used_names = {p["name"] for p in room.players.values()}
                            b_name = next((n for n in BOT_NAMES if n not in used_names), f"Bot {len(room.players)}")
                            room.add_player(bot_id, b_name, is_bot=True)
                            await broadcast_room(current_room_id)

                elif action == "KICK_PLAYER":
                    if current_player_id == room.host_id and room.state == "LOBBY":
                        target_id = data.get("targetPlayerId")
                        if target_id and target_id != current_player_id:
                            room.remove_player(target_id)
                            await broadcast_room(current_room_id)

                elif action == "START_GAME":
                    if current_player_id == room.host_id and room.state == "LOBBY":
                        if room.start_game():
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ERROR",
                                "message": "Need at least 2 players to start game."
                            }))

                elif action == "ROLL_DICE":
                    if room.state == "PLAYING":
                        res = room.roll_dice(current_player_id)
                        if res:
                            await broadcast_room(current_room_id)

                elif action == "PAY_JAIL_FINE":
                    if room.state == "PLAYING":
                        if room.pay_jail_fine(current_player_id):
                            await broadcast_room(current_room_id)

                elif action == "USE_JAIL_CARD":
                    if room.state == "PLAYING":
                        if room.use_jail_card(current_player_id):
                            await broadcast_room(current_room_id)

                elif action == "BUY_PROPERTY":
                    if room.state == "PLAYING":
                        if room.buy_property(current_player_id):
                            await broadcast_room(current_room_id)

                elif action in ["START_AUCTION", "AUCTION_PROPERTY"]:
                    if room.state == "PLAYING":
                        if room.start_property_auction(current_player_id):
                            await broadcast_room(current_room_id)

                elif action in ["PASS_PROPERTY", "DECLINE_PROPERTY"]:
                    if room.state == "PLAYING":
                        if room.pass_property(current_player_id):
                            await broadcast_room(current_room_id)

                elif action in ["AUCTION_BID", "PLACE_BID"]:
                    if room.state == "PLAYING":
                        amount = int(data.get("amount", 0))
                        if room.place_bid(current_player_id, amount):
                            await broadcast_room(current_room_id)

                elif action in ["AUCTION_PASS", "PASS_BID"]:
                    if room.state == "PLAYING":
                        if room.pass_bid(current_player_id):
                            await broadcast_room(current_room_id)

                elif action == "BUILD_HOUSE":
                    if room.state == "PLAYING":
                        tile_id = int(data.get("tileId", -1))
                        res = room.build_house(current_player_id, tile_id)
                        if res:
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ACTION_ERROR",
                                "title": "Cannot Build House",
                                "message": res.reason or "You cannot build a house on this property."
                            }))

                elif action == "SELL_HOUSE":
                    if room.state == "PLAYING":
                        tile_id = int(data.get("tileId", -1))
                        res = room.sell_house(current_player_id, tile_id)
                        if res:
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ACTION_ERROR",
                                "title": "Cannot Sell House",
                                "message": res.reason or "You cannot sell a house from this property."
                            }))

                elif action == "BUILD_SHOP":
                    if room.state == "PLAYING":
                        tile_id = int(data.get("tileId", -1))
                        res = room.build_shop(current_player_id, tile_id)
                        if res:
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ACTION_ERROR",
                                "title": "Cannot Build Shop",
                                "message": res.reason or "You cannot build a shop on this property."
                            }))

                elif action == "SELL_SHOP":
                    if room.state == "PLAYING":
                        tile_id = int(data.get("tileId", -1))
                        res = room.sell_shop(current_player_id, tile_id)
                        if res:
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ACTION_ERROR",
                                "title": "Cannot Sell Shop",
                                "message": res.reason or "You cannot sell a shop from this property."
                            }))

                elif action == "MORTGAGE":
                    if room.state == "PLAYING":
                        tile_id = int(data.get("tileId", -1))
                        res = room.mortgage_property(current_player_id, tile_id)
                        if res:
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ACTION_ERROR",
                                "title": "Cannot Mortgage Property",
                                "message": res.reason or "You cannot mortgage this property."
                            }))

                elif action == "UNMORTGAGE":
                    if room.state == "PLAYING":
                        tile_id = int(data.get("tileId", -1))
                        res = room.unmortgage_property(current_player_id, tile_id)
                        if res:
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ACTION_ERROR",
                                "title": "Cannot Unmortgage Property",
                                "message": res.reason or "You cannot unmortgage this property."
                            }))

                elif action == "PROPOSE_TRADE":
                    if room.state == "PLAYING":
                        receiver_id = data.get("receiverId")
                        offer = data.get("offer", {})
                        request_deal = data.get("request", {})
                        trade_id = room.create_trade(current_player_id, receiver_id, offer, request_deal)
                        if trade_id:
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ACTION_ERROR",
                                "title": "Cannot Propose Trade",
                                "message": "Cannot propose trade: You cannot trade properties with houses or hotels on their color group, or you have insufficient cash."
                            }))

                elif action == "RESPOND_TRADE":
                    if room.state == "PLAYING":
                        trade_id = data.get("tradeId")
                        accept = bool(data.get("accept", False))
                        if room.respond_to_trade(current_player_id, trade_id, accept):
                            await broadcast_room(current_room_id)

                elif action == "CANCEL_TRADE":
                    if room.state == "PLAYING":
                        trade_id = data.get("tradeId")
                        if room.cancel_trade(current_player_id, trade_id):
                            await broadcast_room(current_room_id)

                elif action == "NEGOTIATE_TRADE":
                    if room.state == "PLAYING":
                        orig_trade_id = data.get("tradeId")
                        offer = data.get("offer", {})
                        request_deal = data.get("request", {})
                        new_trade_id = room.negotiate_trade(current_player_id, orig_trade_id, offer, request_deal)
                        if new_trade_id:
                            await broadcast_room(current_room_id)
                        else:
                            await ws.send_str(json.dumps({
                                "type": "ACTION_ERROR",
                                "title": "Cannot Negotiate Trade",
                                "message": "Cannot negotiate trade: You cannot trade properties with houses or hotels on their color group, or you have insufficient cash."
                            }))

                elif action == "RESOLVE_DEBT":
                    if room.state == "PLAYING":
                        if room.resolve_debt(current_player_id):
                            await broadcast_room(current_room_id)

                elif action == "DECLARE_BANKRUPTCY":
                    if room.state == "PLAYING":
                        if room.declare_bankruptcy(current_player_id):
                            await broadcast_room(current_room_id)

                elif action == "END_TURN":
                    if room.state == "PLAYING":
                        if room.end_turn(current_player_id):
                            await broadcast_room(current_room_id)

                elif action == "RESTART_GAME":
                    if current_player_id == room.host_id and (room.state == "GAME_OVER" or room.state == "PLAYING"):
                        room.state = "LOBBY"
                        for tile in room.board_tiles:
                            room.tile_states[tile["id"]] = {"owner": None, "houses": 0, "shops": 0, "mortgaged": False}
                        room.turn_phase = "WAITING_ROLL"
                        room.last_dice = [1, 1]
                        room.consecutive_doubles = 0
                        room.free_parking_pool = 0
                        room.pending_debt = None
                        room.auction = None
                        room.active_trades = {}
                        for p in room.players.values():
                            p["cash"] = room.settings["starting_cash"]
                            p["position"] = 0
                            p["in_jail"] = False
                            p["jail_turns"] = 0
                            p["jail_cards"] = 0
                            p["is_bankrupt"] = False
                            p["properties"] = []
                        room.log("Game reset to lobby by host.", "lobby", "🔄", room.host_id)
                        await broadcast_room(current_room_id)

                elif action == "SEND_REACTION":
                    emoji = data.get("emoji", "😂")
                    meta = socket_meta.get(ws, {})
                    p = room.players.get(current_player_id)
                    sender_name = p["name"] if p else meta.get("player_name", "Spectator")
                    sender_avatar = p["avatar"] if p else meta.get("avatar", "👁️")
                    reaction_msg = json.dumps({
                        "type": "REACTION",
                        "emoji": emoji,
                        "senderId": current_player_id,
                        "senderName": sender_name,
                        "avatar": sender_avatar
                    })
                    for sock in list(room_sockets.get(current_room_id, [])):
                        try:
                            await sock.send_str(reaction_msg)
                        except Exception:
                            pass

                elif action == "SEND_CHAT":
                    text = data.get("text", "")
                    meta = socket_meta.get(ws, {})
                    p = room.players.get(current_player_id)
                    sender_name = p["name"] if p else meta.get("player_name", "Spectator")
                    sender_avatar = p["avatar"] if p else meta.get("avatar", "👁️")
                    sender_color = p["color"] if p else "#94a3b8"
                    msg_obj = room.add_chat_message(
                        current_player_id,
                        text,
                        sender_name=sender_name,
                        color=sender_color,
                        avatar=sender_avatar
                    )
                    if msg_obj:
                        await broadcast_room(current_room_id)

                elif action == "LEAVE_ROOM":
                    room.remove_player(current_player_id)
                    if ws in socket_meta:
                        socket_meta.pop(ws)
                    if current_room_id in room_sockets:
                        room_sockets[current_room_id].discard(ws)
                    await ws.send_str(json.dumps({"type": "LEFT_ROOM"}))
                    if not check_and_cleanup_room(current_room_id):
                        await broadcast_room(current_room_id)
                    current_room_id = None
                    current_player_id = None

            elif msg.type == WSMsgType.ERROR:
                logging.error(f"WebSocket error: {ws.exception()}")

    finally:
        if ws in socket_meta:
            meta = socket_meta.pop(ws)
            rid = meta["room_id"]
            pid = meta["player_id"]
            if rid in room_sockets:
                room_sockets[rid].discard(ws)
            room = rooms.get(rid)
            if room:
                if not meta.get("is_spectator"):
                    p = room.players.get(pid)
                    if p:
                        if room.state == "PLAYING" and not p.get("is_bot") and not p.get("is_bankrupt"):
                            p["connected"] = False
                            p["disconnect_deadline"] = time.time() + 100.0
                            room.log(f"⚠️ {p['name']} disconnected! 100s timer started.", "warning", "🔌", pid)
                        else:
                            room.remove_player(pid)
                if not check_and_cleanup_room(rid):
                    await broadcast_room(rid)

    return ws


async def game_tick_loop():
    """Background task running every 500ms to drive game timers, AI, and auctions"""
    while True:
        try:
            await asyncio.sleep(0.5)
            now = time.time()

            for room_id, room in list(rooms.items()):
                # Clean up / delete room if no real players or 0 players total
                if check_and_cleanup_room(room_id):
                    continue

                if room.state != "PLAYING":
                    continue

                updated = False
                bot_ai = room_bots.get(room_id)

                # 0. Check disconnected players who exceeded 100s grace period
                for pid, p in list(room.players.items()):
                    if not p.get("is_bot") and not p.get("is_bankrupt") and not p.get("connected", True):
                        deadline = p.get("disconnect_deadline")
                        if deadline and now >= deadline:
                            p["disconnect_deadline"] = None
                            room.log(f"💀 {p['name']} failed to reconnect within 100s and was bankrupted.", "bankrupt", "💀", pid)
                            if room.state == "PLAYING":
                                room.declare_bankruptcy(pid)
                            else:
                                room.remove_player(pid)
                            updated = True

                # 1. Auction timer expiration (ends 3 seconds after final bet is placed)
                if room.turn_phase == "AUCTION" and room.auction:
                    deadline = room.auction.get("deadline")
                    if deadline and now >= deadline:
                        room._conclude_auction()
                        updated = True

                # 2. Turn timer countdown check for human players (auto roll / auto end turn)
                curr = room.get_current_player()
                if curr and not curr["is_bot"] and not curr["is_bankrupt"]:
                    if now >= room.turn_deadline:
                        if room.turn_phase == "WAITING_ROLL":
                            room.roll_dice(curr["id"])
                            updated = True
                        elif room.turn_phase == "LANDED_ACTION":
                            # Turn timer ran out while deciding on landed tile -> pass on property and auto end turn
                            room.pass_property(curr["id"])
                            room.end_turn(curr["id"])
                            updated = True
                        elif room.turn_phase == "WAITING_END_TURN":
                            if curr["cash"] < 0:
                                # Automatically declare bankruptcy if player is not able to get into positive value within turn's time
                                room.log(f"⏰ Turn timer expired! {curr['name']} could not clear negative balance (${curr['cash']}) and went bankrupt.", "bankrupt", "💀", curr["id"])
                                room.declare_bankruptcy(curr["id"])
                                updated = True
                            else:
                                room.log(f"⏰ Turn timer expired! {curr['name']}'s turn automatically ended.", "turn", "⏱️", curr["id"])
                                room.end_turn(curr["id"])
                                updated = True
                        elif room.turn_phase == "DEBT":
                            room.declare_bankruptcy(curr["id"])
                            updated = True

                # 3. Bot actions tick
                if bot_ai:
                    if bot_ai.tick():
                        updated = True

                if updated:
                    await broadcast_room(room_id)

        except Exception as e:
            logging.error(f"Exception in game_tick_loop: {e}", exc_info=True)


async def api_board_info(request):
    import importlib
    import game.board_data as bd
    importlib.reload(bd)
    map_name = request.query.get("map", "classic").lower()
    if map_name == "standard":
        map_name = "classic"
    if map_name not in bd.MAPS:
        map_name = "classic"
    cfg = bd.MAPS[map_name]
    return web.json_response({
        "map": map_name,
        "maps": bd.MAPS,
        "tiles": cfg["tiles"],
        "color_groups": cfg["color_groups"]
    }, headers={"Cache-Control": "no-cache, no-store, must-revalidate"})


async def api_rooms_list(request):
    open_rooms = []
    for rid, r in list(rooms.items()):
        is_pub = getattr(r, "is_public", False) or r.settings.get("is_public", False)
        if not is_pub:
            continue
        if check_and_cleanup_room(rid):
            continue
        open_rooms.append({
            "roomId": rid,
            "state": r.state,
            "playersCount": len(r.players),
            "maxPlayers": r.settings["max_players"],
            "hostName": r.players[r.host_id]["name"] if r.host_id and r.host_id in r.players else "Unknown"
        })
    return web.json_response({"rooms": open_rooms})


async def on_startup(app):
    app["tick_task"] = asyncio.create_task(game_tick_loop())


async def on_cleanup(app):
    app["tick_task"].cancel()
    await asyncio.gather(app["tick_task"], return_exceptions=True)


@web.middleware
async def no_cache_middleware(request, handler):
    response = await handler(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


def init_app():
    app = web.Application(middlewares=[no_cache_middleware])
    app.on_startup.append(on_startup)
    app.on_cleanup.append(on_cleanup)

    app.router.add_get("/ws", handle_ws)
    app.router.add_get("/api/board", api_board_info)
    app.router.add_get("/api/rooms", api_rooms_list)

    # Static assets
    app.router.add_static("/css/", path=os.path.join(STATIC_DIR, "css"), name="css")
    app.router.add_static("/js/", path=os.path.join(STATIC_DIR, "js"), name="js")
    app.router.add_static("/img/", path=os.path.join(STATIC_DIR, "img"), name="img")

    async def index(request):
        with open(os.path.join(STATIC_DIR, "index.html"), "r", encoding="utf-8") as f:
            html = f.read()
        ts = str(int(time.time()))
        html = re.sub(r'style\.css(?:\?v=[^"\'\s>]*)?', f'style.css?v={ts}', html)
        html = re.sub(r'game\.js(?:\?v=[^"\'\s>]*)?', f'game.js?v={ts}', html)
        html = re.sub(r'audio\.js(?:\?v=[^"\'\s>]*)?', f'audio.js?v={ts}', html)
        return web.Response(
            text=html,
            content_type="text/html",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )

    async def favicon(request):
        return web.Response(status=204)

    app.router.add_get("/", index)
    app.router.add_get("/favicon.ico", favicon)
    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = init_app()
    web.run_app(app, host="0.0.0.0", port=port)
