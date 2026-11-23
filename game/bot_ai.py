"""
Intelligent Bot AI for Richup.io
Supports three tactical difficulty tiers: Conscious, Balanced, and Determined.
Implements proactive trading, trade negotiation, quick reactions, advanced shops building,
and reaction to active market events.
"""

import time
import random
from typing import Dict, Any, List, Optional, Tuple

BOT_NAMES = [
    "Baron Bot", "Penny Pincher", "Tycoon Tom", "Luna Cash", 
    "Atlas AI", "Capital Carl", "Monopoly Maven", "WallStreet Will"
]

# Color group strategic ranking based on monopoly statistical landing probability & ROI
# In Monopoly theory: Orange (most landed due to Jail distance 6,8,9), Red (Free Parking / Chance),
# Yellow, Light Blue, Dark Blue, Green, Pink, Brown.
GROUP_TIER_RANK: Dict[str, int] = {
    "orange": 10,
    "red": 9,
    "yellow": 8,
    "lightblue": 7,
    "darkblue": 6,
    "green": 5,
    "pink": 4,
    "brown": 2,
    "railroad": 5,
    "utility": 3
}


class BotAI:
    def __init__(self, room):
        self.room = room
        self.last_action_time = 0
        self.action_delay = 1.0  # seconds between bot decisions for smooth natural pacing

        # Cooldown trackers
        self.last_trade_proposal_time: Dict[str, float] = {}  # bot_id -> timestamp
        self.declined_proposals: Dict[Tuple[str, str, int], float] = {}  # (bot_id, target_id, missing_tile_id) -> timestamp
        self.last_seen_event_id: Optional[str] = None
        self.last_log_check_idx: int = 0
        self.last_reaction_time: Dict[str, float] = {}

    def get_difficulty(self) -> str:
        """Returns normalized bot difficulty: 'conscious', 'balanced', or 'determined'."""
        diff = str(self.room.settings.get("bot_difficulty", "balanced")).lower()
        if diff in ["conscious", "balanced", "determined"]:
            return diff
        return "balanced"

    def get_cash_reserve(self, bot: Dict[str, Any]) -> int:
        """Minimum cash the bot wants to keep unspent."""
        diff = self.get_difficulty()
        if diff == "conscious":
            return 450
        elif diff == "balanced":
            return 220
        else:  # determined: aggressive capital efficiency
            return 110

    def send_reaction(self, bot: Dict[str, Any], emoji: str):
        """Dispatches an interactive floating reaction bubble on behalf of the bot."""
        now = time.time()
        last = self.last_reaction_time.get(bot["id"], 0)
        # Avoid spamming reactions more than once every 4 seconds per bot
        if now - last < 4.0:
            return
        self.last_reaction_time[bot["id"]] = now

        if not hasattr(self.room, "pending_reactions"):
            self.room.pending_reactions = []
        self.room.pending_reactions.append({
            "emoji": emoji,
            "senderId": bot["id"],
            "senderName": bot["name"],
            "avatar": bot.get("avatar", "🤖")
        })

    def tick(self) -> bool:
        """Called periodically by server tick loop. Returns True if an action was performed."""
        now = time.time()
        if now - self.last_action_time < self.action_delay:
            return False

        if self.room.state != "PLAYING":
            return False

        # React to game environment (random events, recent log highlights)
        self._check_event_reactions()
        self._check_game_log_reactions()

        # 1. Handle Auctions where bot is a participant
        if self.room.turn_phase == "AUCTION" and self.room.auction:
            for pid in self.room.auction.get("bidders", []):
                if pid not in self.room.auction.get("passed", []):
                    player = self.room.players.get(pid)
                    if player and player["is_bot"] and not player["is_bankrupt"]:
                        if self._handle_bot_auction(player):
                            self.last_action_time = now
                            return True

        # 2. Handle Pending Trades where receiver is a bot
        for trade_id, trade in list(self.room.active_trades.items()):
            if trade.get("status") == "PENDING":
                receiver = self.room.players.get(trade.get("receiver_id"))
                if receiver and receiver["is_bot"] and not receiver["is_bankrupt"]:
                    if self._handle_bot_trade_response(receiver, trade):
                        self.last_action_time = now + 0.5
                        return True

        # 3. Handle Turn for Current Player if bot
        curr = self.room.get_current_player()
        if not curr or not curr["is_bot"] or curr["is_bankrupt"]:
            return False

        # Handle Debt / Negative Cash
        if self.room.turn_phase == "DEBT" or curr["cash"] < 0:
            self._handle_bot_debt(curr)
            self.last_action_time = now
            return True

        # Handle Jail
        if curr["in_jail"] and self.room.turn_phase == "WAITING_ROLL":
            diff = self.get_difficulty()
            if curr["jail_cards"] > 0:
                self.room.use_jail_card(curr["id"])
                self.send_reaction(curr, "🔓")
                self.last_action_time = now
                return True
            elif curr["cash"] >= 350 or (diff == "determined" and curr["cash"] >= 200 and self.room.current_round >= 4):
                # Determined bots pay fine early if they need to stay mobile on the board
                self.room.pay_jail_fine(curr["id"])
                self.send_reaction(curr, "💸")
                self.last_action_time = now + 0.8
                return True
            else:
                self.room.roll_dice(curr["id"])
                self.last_action_time = now + 1.2
                return True

        # Proactive Trading: Bot considers initiating a trade deal on its turn
        if self.room.turn_phase in ["WAITING_ROLL", "WAITING_END_TURN"]:
            if self._maybe_propose_bot_trade(curr):
                self.last_action_time = now + 0.6
                return True

        # Normal Roll
        if self.room.turn_phase == "WAITING_ROLL":
            res = self.room.roll_dice(curr["id"])
            if res and self.room.last_dice and self.room.last_dice[0] == self.room.last_dice[1]:
                # Celebrate doubles roll!
                self.send_reaction(curr, "🎲")
            self.last_action_time = now + 1.4
            return True

        # Buying / Declining property
        if self.room.turn_phase == "LANDED_ACTION":
            self._handle_bot_landed_action(curr)
            self.last_action_time = now
            return True

        # End of turn actions (building shops & houses, unmortgaging, ending turn)
        if self.room.turn_phase == "WAITING_END_TURN":
            # 1. Unmortgage properties if surplus cash allows
            if self._maybe_unmortgage(curr):
                self.last_action_time = now + 0.4
                return True

            # 2. Build houses and advanced shops on owned monopolies
            if self._handle_bot_building(curr):
                self.last_action_time = now + 0.4
                return True

            # End turn
            self.room.end_turn(curr["id"])
            self.last_action_time = now
            return True

        return False

    # ================= Reactive Reactions (Events & Logs) =================

    def _check_event_reactions(self):
        """Bots react with quick reactions when a new market random event begins."""
        active_ev = getattr(self.room, "active_event", None)
        if not active_ev:
            self.last_seen_event_id = None
            return

        ev_id = active_ev.get("id")
        if ev_id != self.last_seen_event_id:
            self.last_seen_event_id = ev_id
            diff = self.get_difficulty()

            # Pick a bot to react
            bots = [p for p in self.room.players.values() if p["is_bot"] and not p["is_bankrupt"]]
            if not bots:
                return

            for bot in bots:
                if ev_id == "URBAN_INFLATION":
                    # +25% property rent
                    has_mono = any(self.room.has_monopoly(bot["id"], gk) for gk in self.room.color_groups)
                    if has_mono:
                        self.send_reaction(bot, "📈" if diff != "determined" else "🔥")
                elif ev_id == "TOURISM_SURGE":
                    # 2x rent on transit / utilities
                    owns_transit = any(
                        self.room.board_tiles[tid]["type"] in ["railroad", "utility"]
                        for tid in bot.get("properties", [])
                    )
                    if owns_transit:
                        self.send_reaction(bot, "⚡")
                elif ev_id == "WEALTH_TAX":
                    richest = max(self.room.players.values(), key=lambda p: p["cash"], default=None)
                    if richest and richest["id"] == bot["id"]:
                        self.send_reaction(bot, "💸")
                elif ev_id == "REAL_ESTATE_BOOM":
                    self.send_reaction(bot, "🏗️")

    def _check_game_log_reactions(self):
        """Bots monitor recent game events to react to bankruptcies, huge rents, or jailings."""
        logs = getattr(self.room, "game_logs", [])
        if not logs or len(logs) <= self.last_log_check_idx:
            self.last_log_check_idx = len(logs)
            return

        new_logs = logs[self.last_log_check_idx:]
        self.last_log_check_idx = len(logs)

        bots = [p for p in self.room.players.values() if p["is_bot"] and not p["is_bankrupt"]]
        if not bots:
            return

        for entry in new_logs:
            cat = entry.get("category", "")
            txt = entry.get("text", "")
            pid = entry.get("player_id")

            if cat == "bankrupt":
                # Someone went bankrupt!
                for bot in bots:
                    if bot["id"] != pid:
                        diff = self.get_difficulty()
                        self.send_reaction(bot, "👑" if diff == "determined" else "💀")
                        break
            elif cat == "jail" and pid:
                # Someone went to jail
                for bot in bots:
                    if bot["id"] != pid:
                        self.send_reaction(bot, "😂" if self.get_difficulty() == "determined" else "🔒")
                        break
            elif cat == "rent" and "paid" in txt.lower():
                # Check if someone paid rent to a bot
                for bot in bots:
                    if bot["name"] in txt and bot["id"] != pid:
                        self.send_reaction(bot, "🤑" if self.get_difficulty() == "determined" else "💰")
                        break

    # ================= Property Purchase & Landed Actions =================

    def _handle_bot_landed_action(self, bot: Dict[str, Any]):
        tile_id = bot["position"]
        tile = self.room.board_tiles[tile_id]
        price = tile.get("price", 0)
        diff = self.get_difficulty()

        if bot["cash"] < price:
            self.room.decline_and_auction(bot["id"])
            return

        # Check if this property completes a monopoly
        group = tile.get("group")
        completes_monopoly = False
        if group and group in self.room.color_groups:
            tiles_in_group = self.room.color_groups[group]["tiles"]
            owned = sum(1 for tid in tiles_in_group if self.room.tile_states[tid]["owner"] == bot["id"])
            if owned == len(tiles_in_group) - 1:
                completes_monopoly = True

        should_buy = False
        if completes_monopoly:
            should_buy = True
        elif diff == "determined":
            # Determined buys nearly every landed property if it leaves a small buffer,
            # knowing properties serve as trading chips or monopoly blocks.
            should_buy = (bot["cash"] >= price + 30)
        elif diff == "balanced":
            should_buy = (bot["cash"] >= price + 100)
        else:  # conscious: casual/careful with cash
            should_buy = (bot["cash"] >= price + 240)

        if should_buy and bot["cash"] >= price:
            self.room.buy_property(bot["id"])
            if completes_monopoly:
                self.send_reaction(bot, "🎉" if diff != "determined" else "✨")
        else:
            self.room.decline_and_auction(bot["id"])

    # ================= Auction Strategy =================

    def _handle_bot_auction(self, bot: Dict[str, Any]) -> bool:
        auction = self.room.auction
        if not auction:
            return False

        if auction.get("highest_bidder") == bot["id"]:
            return False

        tile = self.room.board_tiles[auction["tile_id"]]
        base_price = tile.get("price", 100)
        diff = self.get_difficulty()

        # 1. Check if completing BOT's monopoly
        group = tile.get("group")
        completes_bot_mono = False
        if group and group in self.room.color_groups:
            tiles_in_group = self.room.color_groups[group]["tiles"]
            owned_by_bot = sum(1 for tid in tiles_in_group if self.room.tile_states[tid]["owner"] == bot["id"])
            if owned_by_bot == len(tiles_in_group) - 1:
                completes_bot_mono = True

        # 2. Check if completing an OPPONENT's monopoly
        completes_opp_mono = False
        opp_monopoly_player = None
        if group and group in self.room.color_groups:
            tiles_in_group = self.room.color_groups[group]["tiles"]
            for opp in self.room.players.values():
                if opp["id"] != bot["id"] and not opp["is_bankrupt"]:
                    owned_by_opp = sum(1 for tid in tiles_in_group if self.room.tile_states[tid]["owner"] == opp["id"])
                    if owned_by_opp == len(tiles_in_group) - 1:
                        completes_opp_mono = True
                        opp_monopoly_player = opp
                        break

        # Calculate max valuation based on difficulty & tactical situation
        if diff == "determined":
            if completes_bot_mono:
                # Determined will spend up to 175% to secure a monopoly!
                max_bid = int(base_price * 1.75)
            elif completes_opp_mono:
                # Ruthlessly snipe or drive up price so opponent pays top dollar!
                max_bid = int(base_price * 1.35)
            else:
                max_bid = int(base_price * 0.95)
            min_cash_buffer = 40
        elif diff == "balanced":
            if completes_bot_mono:
                max_bid = int(base_price * 1.4)
            elif completes_opp_mono:
                max_bid = int(base_price * 1.05)
            else:
                max_bid = int(base_price * 0.85)
            min_cash_buffer = 100
        else:  # conscious: casual
            if completes_bot_mono:
                max_bid = int(base_price * 1.1)
            else:
                max_bid = int(base_price * 0.65)
            min_cash_buffer = 200

        highest = auction.get("highest_bid", 0)
        next_bid = highest + 10 if highest > 0 else max(10, base_price // 2)

        if next_bid <= max_bid and next_bid <= bot["cash"] - min_cash_buffer:
            return self.room.place_bid(bot["id"], next_bid)
        else:
            return self.room.pass_bid(bot["id"])

    # ================= Proactive Trading Strategy =================

    def _maybe_propose_bot_trade(self, bot: Dict[str, Any]) -> bool:
        """Bots actively craft and propose win-win or strategically dominant trades."""
        diff = self.get_difficulty()
        if diff == "conscious":
            # Conscious bots rarely instigate trades
            return False

        now = time.time()
        last_prop = self.last_trade_proposal_time.get(bot["id"], 0)
        cooldown = 18.0 if diff == "determined" else 30.0
        if now - last_prop < cooldown:
            return False

        # Do not offer if bot already has an active pending trade
        active_sent = any(
            t["status"] == "PENDING" and t["sender_id"] == bot["id"]
            for t in self.room.active_trades.values()
        )
        if active_sent:
            return False

        # Scan for missing monopoly pieces
        missing_piece_target = self._find_missing_monopoly_piece(bot)
        if not missing_piece_target:
            return False

        missing_tid, missing_owner_id, target_group = missing_piece_target
        target_owner = self.room.players.get(missing_owner_id)
        if not target_owner or target_owner["is_bankrupt"]:
            return False

        # Check declined cooldown
        key = (bot["id"], missing_owner_id, missing_tid)
        if now - self.declined_proposals.get(key, 0) < 60.0:
            return False

        # Pick a tradeable surplus property from the bot's inventory
        tradeable_prop = self._find_tradeable_surplus_property(bot, target_owner)
        if tradeable_prop is None and bot["cash"] < 300:
            return False

        req_tile = self.room.board_tiles[missing_tid]
        req_price = req_tile.get("price", 150)

        # Build offer
        offer_props = [tradeable_prop] if tradeable_prop is not None else []
        offer_prop_val = sum(self.room.board_tiles[t]["price"] for t in offer_props)

        # Cash sweetening to make the deal compelling
        cash_sweetener = 0
        if diff == "determined":
            # Determined crafts an offer the human / opponent is very tempted by
            shortfall = max(0, req_price - offer_prop_val)
            cash_sweetener = shortfall + 150
            cash_sweetener = min(cash_sweetener, max(0, bot["cash"] - self.get_cash_reserve(bot)))
        else:
            shortfall = max(0, req_price - offer_prop_val)
            cash_sweetener = shortfall + 50
            cash_sweetener = min(cash_sweetener, max(0, bot["cash"] - self.get_cash_reserve(bot)))

        offer = {
            "cash": cash_sweetener,
            "properties": offer_props,
            "jail_cards": 0
        }
        request = {
            "cash": 0,
            "properties": [missing_tid],
            "jail_cards": 0
        }

        # Safety check: if determined, verify that giving this property does NOT complete a lethal monopoly for opponent!
        if diff == "determined" and offer_props:
            giving_tid = offer_props[0]
            giving_group = self.room.board_tiles[giving_tid].get("group")
            if giving_group and giving_group in self.room.color_groups:
                g_tiles = self.room.color_groups[giving_group]["tiles"]
                opp_owns = sum(1 for tid in g_tiles if self.room.tile_states[tid]["owner"] == target_owner["id"])
                if opp_owns == len(g_tiles) - 1:
                    # Giving this property gives opponent a monopoly!
                    opp_rank = GROUP_TIER_RANK.get(giving_group, 5)
                    bot_target_rank = GROUP_TIER_RANK.get(target_group, 5)
                    if opp_rank >= bot_target_rank:
                        # Reject creating an opponent monopoly stronger than or equal to bot's!
                        return False

        trade_id = self.room.create_trade(bot["id"], target_owner["id"], offer, request)
        if trade_id:
            self.last_trade_proposal_time[bot["id"]] = now
            self.send_reaction(bot, "🤝" if diff != "determined" else "🧠")
            return True

        return False

    def _find_missing_monopoly_piece(self, bot: Dict[str, Any]) -> Optional[Tuple[int, str, str]]:
        """Finds a property owned by another player that completes a monopoly for this bot."""
        candidates = []
        for group_name, grp in self.room.color_groups.items():
            if grp.get("name") in ["Railroads", "Utilities", "Airports"]:
                continue
            tiles = grp["tiles"]
            bot_owned = [tid for tid in tiles if self.room.tile_states[tid]["owner"] == bot["id"]]
            missing = [tid for tid in tiles if self.room.tile_states[tid]["owner"] != bot["id"]]

            if len(bot_owned) == len(tiles) - 1 and len(missing) == 1:
                missing_tid = missing[0]
                missing_owner = self.room.tile_states[missing_tid]["owner"]
                # Must be owned by an active other player
                if missing_owner and missing_owner != bot["id"]:
                    owner_p = self.room.players.get(missing_owner)
                    if owner_p and not owner_p["is_bankrupt"]:
                        # Also check that missing tile doesn't have houses on its color group
                        has_houses = any(self.room.tile_states[t]["houses"] > 0 for t in tiles)
                        if not has_houses:
                            rank = GROUP_TIER_RANK.get(group_name, 5)
                            candidates.append((rank, missing_tid, missing_owner, group_name))

        if not candidates:
            return None

        # Sort by strategic tier (Orange/Red first)
        candidates.sort(key=lambda x: x[0], reverse=True)
        best = candidates[0]
        return (best[1], best[2], best[3])

    def _find_tradeable_surplus_property(self, bot: Dict[str, Any], recipient: Dict[str, Any]) -> Optional[int]:
        """Finds an isolated, unmonopolized property that bot can spare in a trade deal."""
        diff = self.get_difficulty()
        for tid in list(bot.get("properties", [])):
            tile = self.room.board_tiles[tid]
            grp_name = tile.get("group")
            if not grp_name or grp_name not in self.room.color_groups:
                return tid  # Utilities or railroads are easily tradeable

            grp = self.room.color_groups[grp_name]
            # Must NOT belong to an already completed monopoly!
            if self.room.has_monopoly(bot["id"], grp_name):
                continue

            # Must have 0 houses
            if any(self.room.tile_states[t]["houses"] > 0 for t in grp["tiles"]):
                continue

            # Must not be 1 tile away from monopoly
            bot_owned_in_grp = sum(1 for t in grp["tiles"] if self.room.tile_states[t]["owner"] == bot["id"])
            if bot_owned_in_grp >= len(grp["tiles"]) - 1:
                continue

            # If determined, check that this property won't give the recipient an Orange, Red, or Yellow monopoly
            if diff == "determined":
                rec_owned_in_grp = sum(1 for t in grp["tiles"] if self.room.tile_states[t]["owner"] == recipient["id"])
                if rec_owned_in_grp == len(grp["tiles"]) - 1:
                    rank = GROUP_TIER_RANK.get(grp_name, 5)
                    if rank >= 8:  # Orange, Red, Yellow
                        continue

            return tid

        return None

    # ================= Incoming Trade Evaluation & Negotiation =================

    def _handle_bot_trade_response(self, bot: Dict[str, Any], trade: Dict[str, Any]) -> bool:
        diff = self.get_difficulty()
        sender_id = trade["sender_id"]
        sender = self.room.players.get(sender_id)
        if not sender or sender["is_bankrupt"]:
            self.room.respond_to_trade(bot["id"], trade["id"], accept=False)
            return True

        offer_props = trade["offer"].get("properties", [])
        request_props = trade["request"].get("properties", [])
        offer_cash = trade["offer"].get("cash", 0)
        request_cash = trade["request"].get("cash", 0)

        # Financial valuations
        offer_val = offer_cash + sum(self.room.board_tiles[int(t)]["price"] for t in offer_props)
        offer_val += trade["offer"].get("jail_cards", 0) * 50

        request_val = request_cash + sum(self.room.board_tiles[int(t)]["price"] for t in request_props)
        request_val += trade["request"].get("jail_cards", 0) * 50

        # Monopoly impact check
        gives_bot_mono, bot_mono_group = self._check_if_trade_completes_monopoly(bot["id"], offer_props, outgoing_properties=request_props)
        gives_sender_mono, sender_mono_group = self._check_if_trade_completes_monopoly(sender_id, request_props, outgoing_properties=offer_props)

        # ------------------- 1. DETERMINED (Hardest AI) -------------------
        if diff == "determined":
            # Set competition rule 1: If sender gets a monopoly and bot DOES NOT:
            # INSTANT DECLINE (refuse to hand over the game)
            if gives_sender_mono and not gives_bot_mono:
                self.room.respond_to_trade(bot["id"], trade["id"], accept=False)
                self.send_reaction(bot, "🙅‍♂️")
                # Record declined proposal cooldown
                for tid in request_props:
                    self.declined_proposals[(bot["id"], sender_id, tid)] = time.time()
                return True

            # Set competition rule 2: Both get a monopoly
            if gives_sender_mono and gives_bot_mono:
                bot_rank = GROUP_TIER_RANK.get(bot_mono_group, 5)
                sender_rank = GROUP_TIER_RANK.get(sender_mono_group, 5)

                if bot_rank > sender_rank:
                    # Bot gets higher tier set (e.g. Orange vs Pink) -> accept!
                    self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                    self.send_reaction(bot, "🤝")
                    return True
                elif bot_rank == sender_rank:
                    # Equal ranks: accept if offer includes at least fair value
                    if offer_val >= request_val:
                        self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                        self.send_reaction(bot, "🤝")
                        return True
                    else:
                        # Counter-negotiate: demand cash difference
                        shortfall = int(request_val - offer_val) + 50
                        return self._negotiate_counter(bot, trade, extra_cash_demand=shortfall)
                else:
                    # Sender gets a higher tier set than bot (e.g. Sender gets Orange, Bot gets Brown)
                    # Determined demands heavy cash premium ($300+) to balance power
                    shortfall = int((sender_rank - bot_rank) * 80 + 200)
                    if offer_cash >= shortfall:
                        self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                        self.send_reaction(bot, "🤝")
                        return True
                    else:
                        # Counter-negotiate with cash demand
                        return self._negotiate_counter(bot, trade, extra_cash_demand=shortfall - offer_cash)

            # Set competition rule 3: Bot gets monopoly, sender does NOT
            if gives_bot_mono and not gives_sender_mono:
                # Golden trade for bot! Accept even if paying slight premium
                if bot["cash"] >= request_cash:
                    self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                    self.send_reaction(bot, "✨")
                    return True
                else:
                    # Counter with affordable cash
                    return self._negotiate_counter(bot, trade, extra_cash_demand=0, max_bot_cash=bot["cash"] - 50)

            # Set competition rule 4: Neither gets a monopoly
            if offer_val >= request_val * 1.25:
                self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                self.send_reaction(bot, "🤝")
                return True
            elif 0.85 * request_val <= offer_val < 1.25 * request_val:
                # Close trade: negotiate and ask for cash sweetener
                needed = int(request_val * 1.2 - offer_val)
                return self._negotiate_counter(bot, trade, extra_cash_demand=max(40, needed))
            else:
                self.room.respond_to_trade(bot["id"], trade["id"], accept=False)
                self.send_reaction(bot, "🧐")
                return True

        # ------------------- 2. BALANCED (Standard AI) -------------------
        elif diff == "balanced":
            if gives_bot_mono:
                if not gives_sender_mono or offer_val >= request_val * 0.9:
                    self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                    self.send_reaction(bot, "🤝")
                    return True

            if gives_sender_mono and not gives_bot_mono:
                # Requires significant premium
                if offer_val >= request_val * 1.4:
                    self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                    self.send_reaction(bot, "🤝")
                    return True
                elif offer_val >= request_val:
                    # Negotiate cash difference
                    return self._negotiate_counter(bot, trade, extra_cash_demand=int(request_val * 1.35 - offer_val))
                else:
                    self.room.respond_to_trade(bot["id"], trade["id"], accept=False)
                    return True

            if offer_val >= request_val * 1.1:
                self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                self.send_reaction(bot, "🤝")
                return True
            elif 0.9 * request_val <= offer_val < 1.1 * request_val:
                needed = int(request_val * 1.1 - offer_val)
                return self._negotiate_counter(bot, trade, extra_cash_demand=max(30, needed))
            else:
                self.room.respond_to_trade(bot["id"], trade["id"], accept=False)
                return True

        # ------------------- 3. CONSCIOUS (Casual/Friendly AI) -------------------
        else:
            if offer_val >= request_val * 0.95:
                self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
                self.send_reaction(bot, "😊")
                return True
            else:
                self.room.respond_to_trade(bot["id"], trade["id"], accept=False)
                return True

    def _negotiate_counter(self, bot: Dict[str, Any], original_trade: Dict[str, Any], extra_cash_demand: int = 50, max_bot_cash: Optional[int] = None) -> bool:
        """Constructs and submits a counter-offer using negotiate_trade."""
        sender = self.room.players.get(original_trade["sender_id"])
        if not sender or sender["is_bankrupt"]:
            self.room.respond_to_trade(bot["id"], original_trade["id"], accept=False)
            return True

        # Invert roles: Bot becomes sender of counter-trade, original sender becomes receiver
        counter_offer_props = list(original_trade["request"].get("properties", []))
        counter_request_props = list(original_trade["offer"].get("properties", []))

        counter_offer_cash = original_trade["request"].get("cash", 0)
        bot_cash_avail = max(0, bot["cash"])
        if max_bot_cash is not None:
            counter_offer_cash = min(counter_offer_cash, max(0, max_bot_cash))
        counter_offer_cash = min(counter_offer_cash, bot_cash_avail)

        sender_avail = max(0, sender["cash"])
        counter_request_cash = original_trade["offer"].get("cash", 0) + extra_cash_demand
        # Do not demand more cash than sender possesses
        counter_request_cash = min(counter_request_cash, sender_avail)

        counter_offer = {
            "cash": counter_offer_cash,
            "properties": counter_offer_props,
            "jail_cards": original_trade["request"].get("jail_cards", 0)
        }
        counter_request = {
            "cash": counter_request_cash,
            "properties": counter_request_props,
            "jail_cards": original_trade["offer"].get("jail_cards", 0)
        }

        new_id = self.room.negotiate_trade(bot["id"], original_trade["id"], counter_offer, counter_request)
        if new_id:
            self.send_reaction(bot, "⚖️")
            return True
        else:
            # Fallback: decline cleanly
            self.room.respond_to_trade(bot["id"], original_trade["id"], accept=False)
            return True

    def _check_if_trade_completes_monopoly(self, player_id: str, incoming_properties: List[int], outgoing_properties: Optional[List[int]] = None) -> Tuple[bool, str]:
        """Checks if receiving incoming_properties (and parting with outgoing) allows player_id to complete a color monopoly."""
        if not incoming_properties:
            return False, ""

        p = self.room.players.get(player_id)
        if not p:
            return False, ""

        current_props = set(p.get("properties", []))
        if outgoing_properties:
            current_props = current_props.difference(int(t) for t in outgoing_properties)
        future_props = current_props.union(int(t) for t in incoming_properties)

        for group_name, grp in self.room.color_groups.items():
            if grp.get("name") in ["Railroads", "Utilities", "Airports"]:
                continue
            tiles = set(grp["tiles"])
            # Was not a monopoly before, but is now!
            if not tiles.issubset(current_props) and tiles.issubset(future_props):
                return True, group_name

        return False, ""

    # ================= Building (Houses & Advanced Shops) =================

    def _handle_bot_building(self, bot: Dict[str, Any]) -> bool:
        """Upgrades monopolies with houses, hotels, and advanced shops according to rules and tier."""
        diff = self.get_difficulty()
        cash_reserve = self.get_cash_reserve(bot)
        if bot["cash"] <= cash_reserve:
            return False

        # Find all completed monopolies owned by the bot
        monopoly_groups = []
        for group_name, grp in self.room.color_groups.items():
            if grp.get("name") in ["Railroads", "Utilities", "Airports"]:
                continue
            if self.room.has_monopoly(bot["id"], group_name):
                rank = GROUP_TIER_RANK.get(group_name, 5)
                monopoly_groups.append((rank, group_name, grp))

        if not monopoly_groups:
            return False

        # Sort monopolies so Determined builds Orange/Red/Yellow first
        monopoly_groups.sort(key=lambda x: x[0], reverse=True)

        # ---------------- Phase 1: Build Houses to 3 ----------------
        # (Monopoly Math: 3 houses delivers the lethal inflection point in rent)
        for _, _, grp in monopoly_groups:
            tiles = grp["tiles"]
            # Check even build: find tile with fewest houses
            min_houses = min(self.room.tile_states[t]["houses"] for t in tiles)
            if min_houses < 3:
                for tid in tiles:
                    state = self.room.tile_states[tid]
                    t_info = self.room.board_tiles[tid]
                    h_cost = t_info.get("house_cost", 100)
                    if state["houses"] == min_houses and state["houses"] < 5:
                        if bot["cash"] >= h_cost + cash_reserve:
                            res = self.room.build_house(bot["id"], tid)
                            if res:
                                return True

        # ---------------- Phase 2: Build Advanced Shops ----------------
        # If advanced_shops enabled, construct shops to increase rent & mortgage resilience
        if self.room.settings.get("advanced_shops", True):
            for _, _, grp in monopoly_groups:
                for tid in grp["tiles"]:
                    state = self.room.tile_states[tid]
                    t_info = self.room.board_tiles[tid]
                    s_cost = t_info.get("house_cost", 100)
                    if state.get("shops", 0) == 0:
                        # Determined builds shops once houses reach 3; other tiers build if surplus cash
                        if (diff == "determined" and min_houses >= 3) or (bot["cash"] >= s_cost + cash_reserve + 150):
                            if bot["cash"] >= s_cost + cash_reserve:
                                res = self.room.build_shop(bot["id"], tid)
                                if res:
                                    return True

        # ---------------- Phase 3: Push to 4 Houses & Hotels ----------------
        for _, _, grp in monopoly_groups:
            tiles = grp["tiles"]
            min_houses = min(self.room.tile_states[t]["houses"] for t in tiles)
            if min_houses < 5:
                for tid in tiles:
                    state = self.room.tile_states[tid]
                    t_info = self.room.board_tiles[tid]
                    h_cost = t_info.get("house_cost", 100)
                    if state["houses"] == min_houses:
                        if bot["cash"] >= h_cost + cash_reserve:
                            res = self.room.build_house(bot["id"], tid)
                            if res:
                                return True

        return False

    def _maybe_unmortgage(self, bot: Dict[str, Any]) -> bool:
        """Unmortgages owned properties when cash surplus allows."""
        cash_reserve = self.get_cash_reserve(bot)
        if bot["cash"] <= cash_reserve + 200:
            return False

        for tid in list(bot.get("properties", [])):
            state = self.room.tile_states[tid]
            if state.get("mortgaged", False):
                val = self.room.get_property_mortgage_value(tid)
                cost = int(val * 1.1)
                if bot["cash"] >= cost + cash_reserve:
                    res = self.room.unmortgage_property(bot["id"], tid)
                    if res:
                        return True
        return False

    # ================= Debt Liquidation & Bankruptcy =================

    def _handle_bot_debt(self, bot: Dict[str, Any]):
        """Smart debt resolution: mortgages isolated properties first, then sells houses, avoiding bankruptcy."""
        if bot["cash"] >= 0:
            if self.room.pending_debt:
                self.room.resolve_debt(bot["id"])
            return

        # 1. First, sell advanced shops from unmonopolized properties
        if self.room.settings.get("advanced_shops", True):
            for tid in list(bot.get("properties", [])):
                state = self.room.tile_states[tid]
                tile = self.room.board_tiles[tid]
                grp = tile.get("group")
                if not self.room.has_monopoly(bot["id"], grp) and state.get("shops", 0) > 0:
                    self.room.sell_shop(bot["id"], tid)
                    if bot["cash"] >= 0:
                        if self.room.pending_debt:
                            self.room.resolve_debt(bot["id"])
                        return

        # 2. Mortgage unmonopolized properties
        for tid in list(bot.get("properties", [])):
            state = self.room.tile_states[tid]
            if not state["mortgaged"] and state["houses"] == 0 and state.get("shops", 0) == 0:
                tile = self.room.board_tiles[tid]
                group = tile.get("group")
                if not self.room.has_monopoly(bot["id"], group):
                    self.room.mortgage_property(bot["id"], tid)
                    if bot["cash"] >= 0:
                        if self.room.pending_debt:
                            self.room.resolve_debt(bot["id"])
                        return

        # 3. Sell houses evenly across monopolies
        for tid in list(bot.get("properties", [])):
            state = self.room.tile_states[tid]
            while state["houses"] > 0:
                self.room.sell_house(bot["id"], tid)
                if bot["cash"] >= 0:
                    if self.room.pending_debt:
                        self.room.resolve_debt(bot["id"])
                    return

        # 4. Sell remaining shops
        if self.room.settings.get("advanced_shops", True):
            for tid in list(bot.get("properties", [])):
                state = self.room.tile_states[tid]
                if state.get("shops", 0) > 0:
                    self.room.sell_shop(bot["id"], tid)
                    if bot["cash"] >= 0:
                        if self.room.pending_debt:
                            self.room.resolve_debt(bot["id"])
                        return

        # 5. Mortgage remaining properties (even monopolies)
        for tid in list(bot.get("properties", [])):
            state = self.room.tile_states[tid]
            if not state["mortgaged"] and state["houses"] == 0 and state.get("shops", 0) == 0:
                self.room.mortgage_property(bot["id"], tid)
                if bot["cash"] >= 0:
                    if self.room.pending_debt:
                        self.room.resolve_debt(bot["id"])
                    return

        # 6. If still unable to cover debt, declare bankruptcy
        if bot["cash"] < 0 or (self.room.pending_debt and bot["cash"] < self.room.pending_debt.get("amount", 0)):
            self.send_reaction(bot, "💀")
            self.room.declare_bankruptcy(bot["id"])
        elif self.room.pending_debt:
            self.room.resolve_debt(bot["id"])
