"""
Monopoly / Richup Authoritative Game Engine
Full rule-adherent implementation of Richup.io mechanics.
"""

import copy
import random
import time
import uuid
from typing import Dict, List, Optional, Any
from .board_data import BOARD_TILES, COLOR_GROUPS, CHANCE_CARDS, COMMUNITY_CARDS

DEFAULT_SETTINGS = {
    "starting_cash": 1500,
    "go_salary": 200,
    "double_on_go": True,
    "free_parking_jackpot": True,
    "auction_on_decline": True,
    "turn_timer_seconds": 45,
    "max_players": 6,
    "double_rent_full_set": True,
    "no_rent_in_prison": True,
    "even_build": False,
    "mortgage_enabled": True,
    "is_public": False
}

AVATARS = ["🚗", "🚀", "🎩", "🐶", "🐱", "⛵", "💎", "👑"]
COLORS = [
    "#ef4444", # Red
    "#3b82f6", # Blue
    "#10b981", # Green
    "#f59e0b", # Yellow/Amber
    "#8b5cf6", # Purple
    "#ec4899", # Pink
    "#06b6d4", # Cyan
    "#f97316"  # Orange
]


class ActionResult:
    """Convenience result type that behaves like a bool (if res:) while carrying a reason message."""
    def __init__(self, success: bool, reason: str = ""):
        self.success = bool(success)
        self.reason = str(reason)

    def __bool__(self):
        return self.success

    def __iter__(self):
        return iter((self.success, self.reason))

    def __repr__(self):
        return f"ActionResult(success={self.success}, reason='{self.reason}')"


class GameRoom:
    def __init__(self, room_id: str, host_id: str, host_name: str, is_public: bool = False):
        self.room_id = room_id
        self.host_id = host_id
        self.is_public = is_public
        self.settings = dict(DEFAULT_SETTINGS)
        self.settings["is_public"] = is_public
        self.state = "LOBBY"  # "LOBBY", "PLAYING", "GAME_OVER"

        # Players dictionary: player_id -> dict
        self.players: Dict[str, Dict[str, Any]] = {}
        self.player_order: List[str] = []
        self.current_player_idx = 0

        # Board properties status: tile_id -> {owner: str|None, houses: int, mortgaged: bool}
        self.tile_states: Dict[int, Dict[str, Any]] = {}
        for tile in BOARD_TILES:
            self.tile_states[tile["id"]] = {
                "owner": None,
                "houses": 0,
                "mortgaged": False
            }

        # Game state tracking
        self.turn_phase = "WAITING_ROLL"  # WAITING_ROLL, LANDED_ACTION, WAITING_END_TURN, AUCTION, DEBT
        self.last_dice = [1, 1]
        self.consecutive_doubles = 0
        self.free_parking_pool = 0
        self.last_card = None
        self.pending_debt = None  # {debtor_id, creditor_id, amount}

        # Turn Timer
        self.turn_deadline = 0
        self.turn_count = 0

        # Auction state
        self.auction: Optional[Dict[str, Any]] = None

        # Trade desk & history
        self.active_trades: Dict[str, Dict[str, Any]] = {}
        self.trade_history: List[Dict[str, Any]] = []

        # Auction history
        self.auction_history: List[Dict[str, Any]] = []

        # Activity log
        self.logs: List[Dict[str, Any]] = []

        # In-game & Lobby Chat
        self.chat_messages: List[Dict[str, Any]] = []

        # Decks
        self.chance_deck = copy.deepcopy(CHANCE_CARDS)
        self.community_deck = copy.deepcopy(COMMUNITY_CARDS)
        random.shuffle(self.chance_deck)
        random.shuffle(self.community_deck)

        # Add initial host player
        self.add_player(host_id, host_name, is_host=True)

    def update_settings(self, new_settings: Dict[str, Any]):
        for k, v in new_settings.items():
            if k in self.settings:
                self.settings[k] = v
        if "is_public" in new_settings:
            self.is_public = bool(new_settings["is_public"])
            self.settings["is_public"] = self.is_public

    def log(self, text: str, category: str = "game", icon: str = "🎲", player_id: Optional[str] = None):
        entry = {
            "id": str(uuid.uuid4())[:8],
            "text": text,
            "category": category,
            "icon": icon,
            "player_id": player_id,
            "time": time.time()
        }
        self.logs.append(entry)
        if len(self.logs) > 200:
            self.logs = self.logs[-200:]
        return entry

    def add_player(self, player_id: str, name: str, is_bot: bool = False, is_host: bool = False) -> Optional[Dict[str, Any]]:
        if len(self.players) >= self.settings["max_players"] and not is_bot:
            return None
        if player_id in self.players:
            return self.players[player_id]

        used_colors = {p["color"] for p in self.players.values()}
        used_avatars = {p["avatar"] for p in self.players.values()}

        color = next((c for c in COLORS if c not in used_colors), COLORS[len(self.players) % len(COLORS)])
        avatar = next((a for a in AVATARS if a not in used_avatars), AVATARS[len(self.players) % len(AVATARS)])

        player = {
            "id": player_id,
            "name": name,
            "is_bot": is_bot,
            "is_host": is_host,
            "ready": is_bot,  # Bots are automatically ready
            "color": color,
            "avatar": avatar,
            "cash": self.settings["starting_cash"],
            "position": 0,
            "in_jail": False,
            "jail_turns": 0,
            "jail_cards": 0,
            "is_bankrupt": False,
            "properties": [],
            "connected": True,
            "disconnect_deadline": None
        }

        self.players[player_id] = player
        self.player_order.append(player_id)
        self.log(f"{name} joined the room.", "lobby", "👋", player_id)
        return player

    def remove_player(self, player_id: str):
        if player_id not in self.players:
            return
        name = self.players[player_id]["name"]
        
        if self.state == "LOBBY":
            del self.players[player_id]
            if player_id in self.player_order:
                self.player_order.remove(player_id)
            self.log(f"{name} left the room.", "lobby", "🚪")
        else:
            self.players[player_id]["connected"] = False
            self.log(f"{name} disconnected.", "status", "⚠️", player_id)

        # Host ownership migration: only pass to an actual player, never a bot
        if player_id == self.host_id:
            real_players = [
                p["id"] for p in self.players.values()
                if not p.get("is_bot") and p.get("connected", True)
            ]
            if real_players:
                self.host_id = real_players[0]
                self.players[self.host_id]["is_host"] = True
                self.log(f"Room ownership transferred to {self.players[self.host_id]['name']}.", "lobby", "👑", self.host_id)
            else:
                self.host_id = None

    def start_game(self) -> bool:
        if len(self.players) < 2:
            return False
        self.state = "PLAYING"
        # Shuffle order for fairness
        random.shuffle(self.player_order)
        self.current_player_idx = 0
        self.turn_count = 1
        self.turn_phase = "WAITING_ROLL"
        self.reset_turn_timer()

        # Set all starting cash based on current settings
        for p in self.players.values():
            p["cash"] = self.settings["starting_cash"]
            p["position"] = 0
            p["in_jail"] = False
            p["jail_turns"] = 0
            p["jail_cards"] = 0
            p["is_bankrupt"] = False
            p["properties"] = []

        curr = self.get_current_player()
        self.log(f"Game started! First turn: {curr['name']}", "game", "🚀", curr["id"])
        return True

    def get_current_player(self) -> Dict[str, Any]:
        return self.players[self.player_order[self.current_player_idx]]

    def reset_turn_timer(self):
        duration = self.settings.get("turn_timer_seconds", 45)
        self.turn_deadline = time.time() + duration

    def roll_dice(self, player_id: str) -> Optional[Dict[str, Any]]:
        curr = self.get_current_player()
        if curr["id"] != player_id:
            return None
        if self.turn_phase != "WAITING_ROLL":
            return None

        d1 = random.randint(1, 6)
        d2 = random.randint(1, 6)
        self.last_dice = [d1, d2]
        is_double = (d1 == d2)

        self.log(f"{curr['name']} rolled {d1} and {d2} ({d1 + d2})", "roll", "🎲", curr["id"])

        if curr["in_jail"]:
            return self._handle_jail_roll(curr, d1, d2, is_double)

        if is_double:
            self.consecutive_doubles += 1
            if self.consecutive_doubles == 3:
                self.log(f"{curr['name']} rolled 3 doubles in a row and was sent to Jail!", "jail", "🚨", curr["id"])
                self._send_to_jail(curr)
                self.turn_phase = "WAITING_END_TURN"
                return {
                    "dice": [d1, d2],
                    "is_double": True,
                    "action": "sent_to_jail",
                    "position": curr["position"]
                }
        else:
            self.consecutive_doubles = 0

        # Move player
        steps = d1 + d2
        old_pos = curr["position"]
        new_pos = (old_pos + steps) % 40
        passed_go = (new_pos < old_pos and steps > 0)

        curr["position"] = new_pos

        if passed_go:
            salary = self.settings["go_salary"]
            curr["cash"] += salary
            self.log(f"{curr['name']} passed GO and collected ${salary}!", "money", "💵", curr["id"])

        # Handle landing on new_pos
        result = self._process_tile_landing(curr, new_pos, steps, is_double)
        result["dice"] = [d1, d2]
        result["is_double"] = is_double
        result["passed_go"] = passed_go
        return result

    def _handle_jail_roll(self, player: Dict[str, Any], d1: int, d2: int, is_double: bool) -> Dict[str, Any]:
        if is_double:
            player["in_jail"] = False
            player["jail_turns"] = 0
            self.consecutive_doubles = 0
            self.log(f"{player['name']} rolled doubles ({d1}, {d2}) and escaped Jail!", "jail", "🔓", player["id"])
            steps = d1 + d2
            player["position"] = (10 + steps) % 40
            res = self._process_tile_landing(player, player["position"], steps, False)
            res["dice"] = [d1, d2]
            res["is_double"] = True
            res["escaped_jail"] = True
            return res
        else:
            player["jail_turns"] += 1
            if player["jail_turns"] >= 3:
                # Forced to pay $50 after 3rd fail
                fine = 50
                self.log(f"{player['name']} failed 3rd roll and pays $50 fine to leave Jail.", "jail", "💸", player["id"])
                if player["cash"] >= fine:
                    player["cash"] -= fine
                    if self.settings["free_parking_jackpot"]:
                        self.free_parking_pool += fine
                    player["in_jail"] = False
                    player["jail_turns"] = 0
                    steps = d1 + d2
                    player["position"] = (10 + steps) % 40
                    res = self._process_tile_landing(player, player["position"], steps, False)
                    res["dice"] = [d1, d2]
                    res["is_double"] = False
                    res["escaped_jail"] = True
                    return res
                else:
                    player["cash"] -= fine
                    if self.settings["free_parking_jackpot"]:
                        self.free_parking_pool += fine
                    player["in_jail"] = False
                    player["jail_turns"] = 0
                    steps = d1 + d2
                    player["position"] = (10 + steps) % 40
                    res = self._process_tile_landing(player, player["position"], steps, False)
                    res["dice"] = [d1, d2]
                    res["is_double"] = False
                    res["escaped_jail"] = True
                    return res
            else:
                self.log(f"{player['name']} failed to roll doubles (attempt {player['jail_turns']}/3).", "jail", "🔒", player["id"])
                self.turn_phase = "WAITING_END_TURN"
                return {"dice": [d1, d2], "is_double": False, "action": "still_in_jail"}

    def pay_jail_fine(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id or not curr["in_jail"] or self.turn_phase != "WAITING_ROLL":
            return False
        fine = 50
        if curr["cash"] < fine:
            return False
        curr["cash"] -= fine
        if self.settings["free_parking_jackpot"]:
            self.free_parking_pool += fine
        curr["in_jail"] = False
        curr["jail_turns"] = 0
        self.log(f"{curr['name']} paid $50 fine to get out of Jail.", "jail", "💸", curr["id"])
        return True

    def use_jail_card(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id or not curr["in_jail"] or self.turn_phase != "WAITING_ROLL":
            return False
        if curr["jail_cards"] <= 0:
            return False
        curr["jail_cards"] -= 1
        curr["in_jail"] = False
        curr["jail_turns"] = 0
        self.log(f"{curr['name']} used a 'Get Out of Jail Free' card!", "jail", "🎟️", curr["id"])
        return True

    def _send_to_jail(self, player: Dict[str, Any]):
        player["position"] = 10
        player["in_jail"] = True
        player["jail_turns"] = 0
        self.consecutive_doubles = 0
        self.turn_phase = "WAITING_END_TURN"

    def _process_tile_landing(self, player: Dict[str, Any], tile_id: int, steps: int, is_double: bool) -> Dict[str, Any]:
        tile = BOARD_TILES[tile_id]
        tile_type = tile["type"]
        tile_name = tile["name"]

        res = {
            "tile": tile,
            "action": None
        }

        if tile_type == "go":
            if self.settings["double_on_go"]:
                extra = self.settings["go_salary"]
                player["cash"] += extra
                self.log(f"{player['name']} landed directly on GO! Double salary (+${extra}).", "money", "💰", player["id"])
            self.turn_phase = "WAITING_END_TURN"
            res["action"] = "landed_go"

        elif tile_type in ["property", "railroad", "utility"]:
            state = self.tile_states[tile_id]
            owner_id = state["owner"]

            if owner_id is None:
                # Unowned property: player can buy or auction
                self.turn_phase = "LANDED_ACTION"
                res["action"] = "can_buy"
                self.log(f"{player['name']} landed on unowned {tile_name} (${tile['price']}).", "property", "🏠", player["id"])
            elif owner_id == player["id"]:
                # Own property
                self.turn_phase = "WAITING_END_TURN"
                res["action"] = "own_property"
                self.log(f"{player['name']} landed on their own {tile_name}.", "property", "🏡", player["id"])
            else:
                # Pay rent to owner
                owner = self.players[owner_id]
                if state["mortgaged"]:
                    self.turn_phase = "WAITING_END_TURN"
                    res["action"] = "mortgaged_no_rent"
                    self.log(f"{tile_name} is mortgaged. No rent owed to {owner['name']}.", "rent", "🛡️", player["id"])
                elif owner.get("in_jail") and self.settings.get("no_rent_in_prison", True):
                    self.turn_phase = "WAITING_END_TURN"
                    res["action"] = "owner_in_jail_no_rent"
                    self.log(f"{owner['name']} is in prison! No rent collected for {tile_name}.", "rent", "⛓️", player["id"])
                else:
                    rent = self.calculate_rent(tile_id, steps)
                    res["rent"] = rent
                    res["owner_name"] = owner["name"]
                    is_monopoly_doubled = (tile_type == "property" and state["houses"] == 0 and self.has_monopoly(owner_id, tile.get("group")) and self.settings.get("double_rent_full_set", True))
                    extra_note = " (x2 full-set bonus!)" if is_monopoly_doubled else ""
                    self.log(f"{player['name']} owes ${rent} rent{extra_note} to {owner['name']} for {tile_name}.", "rent", "💳", player["id"])
                    player["cash"] -= rent
                    owner["cash"] += rent
                    self.turn_phase = "WAITING_END_TURN"
                    if player["cash"] < 0:
                        res["action"] = "debt"
                        self.log(f"⚠️ {player['name']} has an unaffordable rent! Balance is now ${player['cash']}. Must liquidate properties or trade before turn timer expires.", "debt", "⚠️", player["id"])
                    else:
                        res["action"] = "paid_rent"

        elif tile_type == "tax":
            tax = tile["tax_amount"]
            self.log(f"{player['name']} landed on {tile_name} (${tax}).", "tax", "⚖️", player["id"])
            player["cash"] -= tax
            if self.settings["free_parking_jackpot"]:
                self.free_parking_pool += tax
            self.turn_phase = "WAITING_END_TURN"
            if player["cash"] < 0:
                res["action"] = "debt"
                self.log(f"⚠️ {player['name']} has a negative balance (${player['cash']}) after paying tax! Must liquidate properties or trade before turn timer expires.", "debt", "⚠️", player["id"])
            else:
                res["action"] = "paid_tax"

        elif tile_type == "parking":
            if self.settings["free_parking_jackpot"] and self.free_parking_pool > 0:
                jackpot = self.free_parking_pool
                player["cash"] += jackpot
                self.free_parking_pool = 0
                self.log(f"{player['name']} hit Free Parking and won the ${jackpot} Jackpot!", "jackpot", "🎉", player["id"])
                res["action"] = "won_jackpot"
                res["jackpot"] = jackpot
            else:
                self.log(f"{player['name']} is resting on Free Parking.", "parking", "🅿️", player["id"])
                res["action"] = "free_parking"
            self.turn_phase = "WAITING_END_TURN"

        elif tile_type == "gotojail":
            self.log(f"{player['name']} landed on Go To Jail!", "jail", "👮", player["id"])
            self._send_to_jail(player)
            res["action"] = "sent_to_jail"

        elif tile_type == "jail":
            self.log(f"{player['name']} is Just Visiting Jail.", "jail", "👀", player["id"])
            self.turn_phase = "WAITING_END_TURN"
            res["action"] = "visiting_jail"

        elif tile_type in ["chance", "chest"]:
            card_res = self._draw_card(player, tile_type)
            res["action"] = "card"
            res["card"] = card_res

        return res

    def calculate_rent(self, tile_id: int, dice_roll: int = 7) -> int:
        tile = BOARD_TILES[tile_id]
        state = self.tile_states[tile_id]
        owner_id = state["owner"]
        if not owner_id or state["mortgaged"]:
            return 0

        # Don't collect rent while in prison (if enabled in room settings)
        owner = self.players.get(owner_id)
        if owner and owner.get("in_jail") and self.settings.get("no_rent_in_prison", True):
            return 0

        tile_type = tile["type"]
        group_key = tile.get("group")
        group_info = COLOR_GROUPS.get(group_key)

        if tile_type == "property":
            houses = state["houses"]
            base_rent = tile["rent"][houses]
            if houses == 0 and self.has_monopoly(owner_id, group_key) and self.settings.get("double_rent_full_set", True):
                return base_rent * 2
            return base_rent

        elif tile_type == "railroad":
            owned_railroads = sum(1 for tid in group_info["tiles"] if self.tile_states[tid]["owner"] == owner_id)
            return tile["rent"][min(owned_railroads - 1, 3)]

        elif tile_type == "utility":
            owned_utilities = sum(1 for tid in group_info["tiles"] if self.tile_states[tid]["owner"] == owner_id)
            multiplier = 10 if owned_utilities == 2 else 4
            return dice_roll * multiplier

        return 0

    def has_monopoly(self, player_id: str, group_key: str) -> bool:
        if group_key not in COLOR_GROUPS:
            return False
        tiles = COLOR_GROUPS[group_key]["tiles"]
        return all(self.tile_states[tid]["owner"] == player_id for tid in tiles)

    def _draw_card(self, player: Dict[str, Any], deck_type: str) -> Dict[str, Any]:
        deck = self.chance_deck if deck_type == "chance" else self.community_deck
        if not deck:
            refill = copy.deepcopy(CHANCE_CARDS if deck_type == "chance" else COMMUNITY_CARDS)
            random.shuffle(refill)
            deck.extend(refill)

        card = deck.pop(0)
        self.last_card = {
            "type": deck_type,
            "title": card["title"],
            "desc": card["desc"],
            "player_name": player["name"]
        }
        self.log(f"{player['name']} drew {card['title']}: {card['desc']}", "card", "🎴", player["id"])

        action = card["action"]
        if action == "collect":
            player["cash"] += card["amount"]
            self.turn_phase = "WAITING_END_TURN"

        elif action == "pay":
            amount = card["amount"]
            player["cash"] -= amount
            if self.settings["free_parking_jackpot"]:
                self.free_parking_pool += amount
            self.turn_phase = "WAITING_END_TURN"
            if player["cash"] < 0:
                self.log(f"⚠️ {player['name']} has a negative balance (${player['cash']})! Must liquidate properties or trade before turn timer expires.", "debt", "⚠️", player["id"])

        elif action == "move_to":
            old_pos = player["position"]
            target = card["target"]
            if target < old_pos and target != 10:  # Passed GO
                salary = self.settings["go_salary"]
                player["cash"] += salary
                self.log(f"{player['name']} passed GO and collected ${salary}!", "money", "💵", player["id"])
            player["position"] = target
            self._process_tile_landing(player, target, 7, False)

        elif action == "move_steps":
            steps = card["steps"]
            player["position"] = (player["position"] + steps) % 40
            self._process_tile_landing(player, player["position"], 7, False)

        elif action == "nearest_railroad":
            railroads = [5, 15, 25, 35]
            pos = player["position"]
            nearest = min(railroads, key=lambda r: (r - pos) % 40)
            if nearest < pos:
                player["cash"] += self.settings["go_salary"]
            player["position"] = nearest
            self._process_tile_landing(player, nearest, 7, False)

        elif action == "nearest_utility":
            utilities = [12, 28]
            pos = player["position"]
            nearest = min(utilities, key=lambda u: (u - pos) % 40)
            if nearest < pos:
                player["cash"] += self.settings["go_salary"]
            player["position"] = nearest
            self._process_tile_landing(player, nearest, 7, False)

        elif action == "jail_free":
            player["jail_cards"] += 1
            self.turn_phase = "WAITING_END_TURN"

        elif action == "goto_jail":
            self._send_to_jail(player)

        elif action == "repairs":
            house_rate = card["house"]
            hotel_rate = card["hotel"]
            total_houses = 0
            total_hotels = 0
            for tid in player["properties"]:
                h = self.tile_states[tid]["houses"]
                if h == 5:
                    total_hotels += 1
                elif h > 0:
                    total_houses += h
            cost = (total_houses * house_rate) + (total_hotels * hotel_rate)
            if cost > 0:
                player["cash"] -= cost
                if self.settings["free_parking_jackpot"]:
                    self.free_parking_pool += cost
                self.turn_phase = "WAITING_END_TURN"
                if player["cash"] < 0:
                    self.log(f"⚠️ {player['name']} has a negative balance (${player['cash']}) after property repairs! Must liquidate or trade before turn ends.", "debt", "⚠️", player["id"])
            else:
                self.turn_phase = "WAITING_END_TURN"

        elif action == "pay_each":
            amount = card["amount"]
            active_opponents = [p for p in self.players.values() if p["id"] != player["id"] and not p["is_bankrupt"]]
            total_needed = amount * len(active_opponents)
            player["cash"] -= total_needed
            for opp in active_opponents:
                opp["cash"] += amount
            self.turn_phase = "WAITING_END_TURN"
            if player["cash"] < 0:
                self.log(f"⚠️ {player['name']} has a negative balance (${player['cash']}) after paying each player! Must liquidate or trade before turn ends.", "debt", "⚠️", player["id"])

        elif action == "collect_each":
            amount = card["amount"]
            for opp in self.players.values():
                if opp["id"] != player["id"] and not opp["is_bankrupt"]:
                    paid = min(opp["cash"], amount)
                    opp["cash"] -= paid
                    player["cash"] += paid
            self.turn_phase = "WAITING_END_TURN"

        return card

    def buy_property(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id or self.turn_phase != "LANDED_ACTION":
            return False

        tile_id = curr["position"]
        tile = BOARD_TILES[tile_id]
        state = self.tile_states[tile_id]

        if state["owner"] is not None:
            return False
        price = tile.get("price", 0)
        if curr["cash"] < price:
            return False

        curr["cash"] -= price
        state["owner"] = curr["id"]
        curr["properties"].append(tile_id)
        self.turn_phase = "WAITING_END_TURN"
        self.log(f"{curr['name']} bought {tile['name']} for ${price}!", "purchase", "🏡", curr["id"])
        return True

    def start_property_auction(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id or self.turn_phase != "LANDED_ACTION":
            return False
        if not self.settings.get("auction_on_decline", True):
            return False
        tile_id = curr["position"]
        tile = BOARD_TILES[tile_id]
        self.log(f"{curr['name']} put {tile['name']} up for Public Auction!", "auction", "⚖️", curr["id"])
        self.start_auction(tile_id)
        return True

    def pass_property(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id or self.turn_phase != "LANDED_ACTION":
            return False
        tile_id = curr["position"]
        tile = BOARD_TILES[tile_id]
        self.log(f"{curr['name']} decided not to buy {tile['name']}.", "property", "⏭️", curr["id"])
        self.turn_phase = "WAITING_END_TURN"
        return True

    def decline_and_auction(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id or self.turn_phase != "LANDED_ACTION":
            return False

        tile_id = curr["position"]
        tile = BOARD_TILES[tile_id]

        if self.settings.get("auction_on_decline", True):
            self.log(f"{curr['name']} opted to auction {tile['name']}.", "auction", "⚖️", curr["id"])
            self.start_auction(tile_id)
        else:
            self.log(f"{curr['name']} passed on buying {tile['name']}.", "property", "⏭️", curr["id"])
            self.turn_phase = "WAITING_END_TURN"
        return True

    def start_auction(self, tile_id: int):
        tile = BOARD_TILES[tile_id]
        bidders = [p["id"] for p in self.players.values() if not p["is_bankrupt"]]
        self.auction = {
            "tile_id": tile_id,
            "tile_name": tile["name"],
            "price": tile["price"],
            "highest_bid": 0,
            "highest_bidder": None,
            "bidders": bidders,
            "passed": [],
            "deadline": None  # Auction has no running timer initially; ends 3s after final bet is held
        }
        self.turn_phase = "AUCTION"
        self.log(f"Public Auction started for {tile['name']}!", "auction", "⚖️")

    def place_bid(self, player_id: str, amount: int) -> bool:
        if not self.auction or self.turn_phase != "AUCTION":
            return False
        player = self.players.get(player_id)
        if not player or player["is_bankrupt"] or player_id in self.auction["passed"]:
            return False
        if amount <= self.auction["highest_bid"] or amount > player["cash"]:
            return False

        self.auction["highest_bid"] = amount
        self.auction["highest_bidder"] = player_id
        # Auctions end only after 3 seconds after players hold their final bet
        self.auction["deadline"] = time.time() + 3.0

        self.log(f"{player['name']} bid ${amount} for {self.auction['tile_name']}.", "auction", "🏷️", player_id)
        return True

    def pass_bid(self, player_id: str) -> bool:
        if not self.auction or self.turn_phase != "AUCTION":
            return False
        if player_id not in self.auction["passed"]:
            self.auction["passed"].append(player_id)
            player = self.players.get(player_id)
            if player:
                self.log(f"{player['name']} passed on {self.auction['tile_name']}.", "auction", "✋", player_id)

        # Check if only 1 bidder left or all passed
        active_left = [b for b in self.auction["bidders"] if b not in self.auction["passed"]]
        if len(active_left) == 0:
            self._conclude_auction()
        elif len(active_left) == 1 and self.auction["highest_bidder"] == active_left[0]:
            # The only active bidder is the highest bidder
            self._conclude_auction()
        return True

    def _conclude_auction(self):
        if not self.auction:
            return
        winner_id = self.auction["highest_bidder"]
        tile_id = self.auction["tile_id"]
        tile = BOARD_TILES[tile_id]
        state = self.tile_states[tile_id]

        if winner_id and self.auction["highest_bid"] > 0:
            winner = self.players[winner_id]
            bid = self.auction["highest_bid"]
            winner["cash"] -= bid
            state["owner"] = winner_id
            winner["properties"].append(tile_id)
            self.log(f"Auction won by {winner['name']} for ${bid}!", "auction", "🏆", winner_id)
            self.auction_history.append({
                "tile_id": tile_id,
                "tile_name": tile["name"],
                "winner_id": winner_id,
                "winner_name": winner["name"],
                "bid": bid,
                "time": time.time(),
                "status": "WON"
            })
        else:
            self.log(f"Auction for {tile['name']} ended with no bids.", "auction", "❌")
            self.auction_history.append({
                "tile_id": tile_id,
                "tile_name": tile["name"],
                "winner_id": None,
                "winner_name": None,
                "bid": 0,
                "time": time.time(),
                "status": "UNSOLD"
            })

        self.auction = None
        self.turn_phase = "WAITING_END_TURN"
        # Ensure player has at least 15 seconds remaining on turn timer after auction ends
        if self.turn_deadline <= time.time() + 10:
            self.turn_deadline = time.time() + 15

    def end_turn(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id:
            return False
        if self.turn_phase not in ["WAITING_END_TURN"]:
            return False
        # Cannot end turn while in negative balance
        if curr["cash"] < 0:
            return False

        # If doubles were rolled and player is not in jail and rolled < 3 doubles, they get another turn!
        d1, d2 = self.last_dice
        if d1 == d2 and not curr["in_jail"] and self.consecutive_doubles < 3 and self.consecutive_doubles > 0:
            self.log(f"{curr['name']} rolled doubles and takes another turn!", "turn", "🎲", curr["id"])
            self.turn_phase = "WAITING_ROLL"
            self.reset_turn_timer()
            return True

        self.consecutive_doubles = 0
        self._advance_to_next_player()
        return True

    def _advance_to_next_player(self):
        # Move index to next non-bankrupt player
        attempts = 0
        while attempts < len(self.player_order):
            self.current_player_idx = (self.current_player_idx + 1) % len(self.player_order)
            next_player = self.players[self.player_order[self.current_player_idx]]
            if not next_player["is_bankrupt"]:
                break
            attempts += 1

        self.turn_count += 1
        self.turn_phase = "WAITING_ROLL"
        self.reset_turn_timer()

        # Check win condition
        active_players = [p for p in self.players.values() if not p["is_bankrupt"]]
        if len(active_players) <= 1:
            self._handle_game_won(active_players[0] if active_players else None)
            return

        curr = self.get_current_player()
        self.log(f"Turn {self.turn_count}: {curr['name']}'s turn.", "turn", "⏳", curr["id"])

    def _enter_debt(self, debtor: Dict[str, Any], creditor_id: Optional[str], amount: int, reason: str):
        self.pending_debt = {
            "debtor_id": debtor["id"],
            "creditor_id": creditor_id,
            "amount": amount,
            "reason": reason
        }
        self.turn_phase = "DEBT"
        creditor_name = self.players[creditor_id]["name"] if creditor_id else "the Bank"
        self.log(f"{debtor['name']} is in debt (${amount}) to {creditor_name}! Must liquidate or declare bankruptcy.", "debt", "⚠️", debtor["id"])

    def declare_bankruptcy(self, player_id: str) -> bool:
        player = self.players.get(player_id)
        if not player or player["is_bankrupt"]:
            return False

        player["is_bankrupt"] = True
        self.log(f"{player['name']} declared Bankruptcy and is eliminated!", "bankrupt", "💀", player_id)

        # "making all your properties unowned available anytime of the match"
        for tid in list(player["properties"]):
            state = self.tile_states[tid]
            state["owner"] = None
            state["houses"] = 0
            state["mortgaged"] = False

        player["cash"] = 0
        player["properties"] = []
        player["jail_cards"] = 0
        self.pending_debt = None

        # Check if it was this player's turn
        curr = self.get_current_player()
        was_current_turn = (curr and curr["id"] == player_id)

        # Check win condition
        active = [p for p in self.players.values() if not p["is_bankrupt"]]
        if len(active) <= 1:
            self._handle_game_won(active[0] if active else None)
        elif was_current_turn:
            self._advance_to_next_player()
        return True

    def resolve_debt(self, player_id: str) -> bool:
        if not self.pending_debt or self.pending_debt["debtor_id"] != player_id:
            return False
        debtor = self.players[player_id]
        amount = self.pending_debt["amount"]
        if debtor["cash"] < amount:
            return False

        debtor["cash"] -= amount
        creditor_id = self.pending_debt["creditor_id"]
        if creditor_id:
            creditor = self.players[creditor_id]
            creditor["cash"] += amount
        elif self.settings["free_parking_jackpot"]:
            self.free_parking_pool += amount

        self.log(f"{debtor['name']} cleared debt of ${amount}.", "money", "✅", player_id)
        self.pending_debt = None
        self.turn_phase = "WAITING_END_TURN"
        return True

    def _handle_game_won(self, winner: Optional[Dict[str, Any]]):
        self.state = "GAME_OVER"
        winner_name = winner["name"] if winner else "Nobody"
        self.log(f"Game Over! {winner_name} won the match! 🏆", "winner", "🎉", winner["id"] if winner else None)

    # Building & Mortgage
    def build_house(self, player_id: str, tile_id: int) -> ActionResult:
        player = self.players.get(player_id)
        tile = BOARD_TILES[tile_id]
        state = self.tile_states[tile_id]

        if not player:
            return ActionResult(False, "Player not found.")
        if state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if tile["type"] != "property":
            return ActionResult(False, "You can only build houses on color properties (not stations or utilities).")

        group_key = tile["group"]
        if not self.has_monopoly(player_id, group_key):
            grp_name = COLOR_GROUPS[group_key].get("name", group_key).title()
            return ActionResult(False, f"Monopoly Required: You must own all properties in the {grp_name} color set before building houses.")

        group_tiles = COLOR_GROUPS[group_key]["tiles"]
        # Check none are mortgaged
        if any(self.tile_states[tid]["mortgaged"] for tid in group_tiles):
            return ActionResult(False, "Cannot Build: One of the properties in this color set is currently mortgaged. You must unmortgage it first.")

        # Current houses must be < 5 (5 is hotel)
        if state["houses"] >= 5:
            return ActionResult(False, "Maximum Limit Reached: A Hotel (5 houses) is already built on this property.")

        # Even build rule: target property cannot have more houses than any other in group
        if self.settings.get("even_build", True):
            min_houses = min(self.tile_states[tid]["houses"] for tid in group_tiles)
            if state["houses"] > min_houses:
                return ActionResult(False, f"Even Build Rule: You must build evenly across the set. You cannot build a house here until all other properties in this set have at least {state['houses']} houses.")

        cost = tile["house_cost"]
        if player["cash"] < cost:
            return ActionResult(False, f"Insufficient Cash: Building a house costs ${cost}, but your balance is only ${player['cash']}.")

        player["cash"] -= cost
        state["houses"] += 1
        h_str = "Hotel" if state["houses"] == 5 else f"House {state['houses']}"
        self.log(f"{player['name']} built a {h_str} on {tile['name']} for ${cost}.", "build", "🏠", player_id)
        return ActionResult(True, f"Successfully built {h_str} on {tile['name']}.")

    def sell_house(self, player_id: str, tile_id: int) -> ActionResult:
        player = self.players.get(player_id)
        tile = BOARD_TILES[tile_id]
        state = self.tile_states[tile_id]

        if not player or state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if state["houses"] <= 0:
            return ActionResult(False, "There are no houses to sell on this property.")

        group_key = tile["group"]
        group_tiles = COLOR_GROUPS[group_key]["tiles"]

        # Even selling rule: target property cannot have fewer houses than any other in group
        if self.settings.get("even_build", True):
            max_houses = max(self.tile_states[tid]["houses"] for tid in group_tiles)
            if state["houses"] < max_houses:
                return ActionResult(False, f"Even Sell Rule: You must sell evenly across the set. You must sell houses from properties with {max_houses} houses first.")

        refund = tile["house_cost"] // 2
        state["houses"] -= 1
        player["cash"] += refund
        self.log(f"{player['name']} sold a house on {tile['name']} for ${refund}.", "sell", "🔨", player_id)
        return ActionResult(True, f"Successfully sold a house on {tile['name']} for ${refund}.")

    def mortgage_property(self, player_id: str, tile_id: int) -> ActionResult:
        if not self.settings.get("mortgage_enabled", True):
            return ActionResult(False, "Mortgaging properties is disabled in this room.")
        player = self.players.get(player_id)
        tile = BOARD_TILES[tile_id]
        state = self.tile_states[tile_id]

        if not player or state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if state["mortgaged"]:
            return ActionResult(False, "This property is already mortgaged.")

        if tile["type"] == "property":
            group_tiles = COLOR_GROUPS[tile["group"]]["tiles"]
            if any(self.tile_states[tid]["houses"] > 0 for tid in group_tiles):
                return ActionResult(False, "Cannot Mortgage: You must sell all houses/hotels across this entire color set before mortgaging any property in it.")

        val = tile["mortgage"]
        state["mortgaged"] = True
        player["cash"] += val
        self.log(f"{player['name']} mortgaged {tile['name']} for ${val}.", "mortgage", "📑", player_id)
        return ActionResult(True, f"Successfully mortgaged {tile['name']} for ${val}.")

    def unmortgage_property(self, player_id: str, tile_id: int) -> ActionResult:
        player = self.players.get(player_id)
        tile = BOARD_TILES[tile_id]
        state = self.tile_states[tile_id]

        if not player or state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if not state["mortgaged"]:
            return ActionResult(False, "This property is not currently mortgaged.")

        cost = int(tile["mortgage"] * 1.1)
        if player["cash"] < cost:
            return ActionResult(False, f"Insufficient Cash: Unmortgaging costs ${cost} (principal + 10% interest), but your balance is only ${player['cash']}.")

        player["cash"] -= cost
        state["mortgaged"] = False
        self.log(f"{player['name']} unmortgaged {tile['name']} for ${cost}.", "mortgage", "🔑", player_id)
        return ActionResult(True, f"Successfully unmortgaged {tile['name']}.")

    # Trading System
    def create_trade(self, sender_id: str, receiver_id: str, offer: Dict[str, Any], request: Dict[str, Any]) -> Optional[str]:
        if not hasattr(self, "trade_history"):
            self.trade_history = []
        sender = self.players.get(sender_id)
        receiver = self.players.get(receiver_id)
        if not sender or not receiver or sender["is_bankrupt"] or receiver["is_bankrupt"]:
            return None

        # Sanitize properties to integer IDs
        offer_props = [int(x) for x in offer.get("properties", [])]
        request_props = [int(x) for x in request.get("properties", [])]
        offer["properties"] = offer_props
        request["properties"] = request_props

        # Validate offer
        if offer.get("cash", 0) > sender["cash"] or offer.get("jail_cards", 0) > sender["jail_cards"]:
            return None
        for tid in offer_props:
            if self.tile_states[tid]["owner"] != sender_id:
                return None
            # Must have 0 houses on entire color group
            t = BOARD_TILES[tid]
            if t["type"] == "property" and any(self.tile_states[ot]["houses"] > 0 for ot in COLOR_GROUPS[t["group"]]["tiles"]):
                return None

        # Validate request
        if request.get("cash", 0) > receiver["cash"] or request.get("jail_cards", 0) > receiver["jail_cards"]:
            return None
        for tid in request_props:
            if self.tile_states[tid]["owner"] != receiver_id:
                return None
            t = BOARD_TILES[tid]
            if t["type"] == "property" and any(self.tile_states[ot]["houses"] > 0 for ot in COLOR_GROUPS[t["group"]]["tiles"]):
                return None

        trade_id = str(uuid.uuid4())[:8]
        self.active_trades[trade_id] = {
            "id": trade_id,
            "sender_id": sender_id,
            "sender_name": sender["name"],
            "receiver_id": receiver_id,
            "receiver_name": receiver["name"],
            "offer": offer,
            "request": request,
            "status": "PENDING",
            "created_at": time.time()
        }
        self.log(f"{sender['name']} proposed a trade deal to {receiver['name']}.", "trade", "🤝", sender_id)
        return trade_id

    def respond_to_trade(self, player_id: str, trade_id: str, accept: bool) -> bool:
        trade = self.active_trades.get(trade_id)
        if not trade or trade["status"] != "PENDING":
            return False
        if trade["receiver_id"] != player_id:
            return False

        sender = self.players.get(trade["sender_id"])
        receiver = self.players.get(trade["receiver_id"])
        if not sender or not receiver:
            trade["status"] = "CANCELLED"
            return False

        if not accept:
            trade["status"] = "DECLINED"
            trade["resolved_at"] = time.time()
            self.trade_history.append(trade.copy())
            self.active_trades.pop(trade_id, None)
            self.log(f"{receiver['name']} rejected trade offer from {sender['name']}.", "trade", "❌", receiver["id"])
            return True

        # Check conditions still hold
        offer = trade["offer"]
        request = trade["request"]
        if offer.get("cash", 0) > sender["cash"] or request.get("cash", 0) > receiver["cash"]:
            trade["status"] = "CANCELLED"
            trade["resolved_at"] = time.time()
            self.trade_history.append(trade.copy())
            self.active_trades.pop(trade_id, None)
            return False

        # Execute exchange
        sender["cash"] += request.get("cash", 0) - offer.get("cash", 0)
        receiver["cash"] += offer.get("cash", 0) - request.get("cash", 0)

        sender["jail_cards"] += request.get("jail_cards", 0) - offer.get("jail_cards", 0)
        receiver["jail_cards"] += offer.get("jail_cards", 0) - request.get("jail_cards", 0)

        for tid in [int(x) for x in offer.get("properties", [])]:
            if tid in sender["properties"]:
                sender["properties"].remove(tid)
            if tid not in receiver["properties"]:
                receiver["properties"].append(tid)
            self.tile_states[tid]["owner"] = receiver["id"]

        for tid in [int(x) for x in request.get("properties", [])]:
            if tid in receiver["properties"]:
                receiver["properties"].remove(tid)
            if tid not in sender["properties"]:
                sender["properties"].append(tid)
            self.tile_states[tid]["owner"] = sender["id"]

        trade["status"] = "ACCEPTED"
        trade["resolved_at"] = time.time()
        self.trade_history.append(trade.copy())
        self.active_trades.pop(trade_id, None)
        self.log(f"Trade completed between {sender['name']} and {receiver['name']}!", "trade", "🎉")
        return True

    def cancel_trade(self, player_id: str, trade_id: str) -> bool:
        trade = self.active_trades.get(trade_id)
        if not trade or trade["status"] != "PENDING":
            return False
        if trade["sender_id"] != player_id and trade["receiver_id"] != player_id:
            return False
        trade["status"] = "DECLINED" if player_id == trade["receiver_id"] else "CANCELLED"
        trade["resolved_at"] = time.time()
        self.trade_history.append(trade.copy())
        self.active_trades.pop(trade_id, None)
        action_name = "declined" if player_id == trade["receiver_id"] else "cancelled"
        self.log(f"Trade between {trade['sender_name']} and {trade['receiver_name']} was {action_name}.", "trade", "❌")
        return True

    def negotiate_trade(self, player_id: str, original_trade_id: str, offer: Dict[str, Any], request: Dict[str, Any]) -> Optional[str]:
        orig = self.active_trades.get(original_trade_id)
        if not orig or orig["status"] != "PENDING":
            return None
        if orig["receiver_id"] != player_id:
            return None

        partner_id = orig["sender_id"]

        # Validate and create counter trade first
        new_trade_id = self.create_trade(player_id, partner_id, offer, request)
        if not new_trade_id:
            return None

        # Archive original trade as COUNTERED
        orig["status"] = "COUNTERED"
        orig["resolved_at"] = time.time()
        self.trade_history.append(orig.copy())
        self.active_trades.pop(original_trade_id, None)

        p = self.players.get(player_id)
        partner = self.players.get(partner_id)
        p_name = p["name"] if p else "Player"
        partner_name = partner["name"] if partner else "Player"
        self.log(f"{p_name} countered the trade offer from {partner_name}.", "trade", "⚖️", player_id)
        return new_trade_id

    # Chat System
    def add_chat_message(self, player_id: str, text: str, sender_name: Optional[str] = None, color: Optional[str] = None, avatar: Optional[str] = None) -> Optional[Dict[str, Any]]:
        clean_text = str(text).strip()[:250]
        if not clean_text:
            return None
        p = self.players.get(player_id)
        name = sender_name or (p["name"] if p else "Player")
        c = color or (p["color"] if p else "#94a3b8")
        av = avatar or (p["avatar"] if p else "💬")
        msg = {
            "id": str(uuid.uuid4())[:8],
            "player_id": player_id,
            "sender_name": name,
            "color": c,
            "avatar": av,
            "text": clean_text,
            "time": time.time()
        }
        self.chat_messages.append(msg)
        if len(self.chat_messages) > 100:
            self.chat_messages = self.chat_messages[-100:]
        return msg

    # Net worth calculation
    def get_player_net_worth(self, player_id: str) -> int:
        player = self.players.get(player_id)
        if not player:
            return 0
        nw = player["cash"]
        for tid in player["properties"]:
            tile = BOARD_TILES[tid]
            state = self.tile_states[tid]
            if state["mortgaged"]:
                nw += tile.get("mortgage", 0)
            else:
                nw += tile.get("price", 0)
                houses = state.get("houses", 0)
                nw += houses * (tile.get("house_cost", 0) // 2)
        return nw

    def serialize(self) -> Dict[str, Any]:
        """Returns the full public game state for broadcasting to clients"""
        now = time.time()
        players_serialized = []
        for pid in self.player_order:
            if pid not in self.players:
                continue
            p = self.players[pid]
            p_data = dict(p)
            p_data["net_worth"] = self.get_player_net_worth(pid)

            # Calculate asset breakdown for detailed player view
            prop_val = 0
            houses_val = 0
            for tid in p["properties"]:
                t = BOARD_TILES[tid]
                st = self.tile_states[tid]
                if st["mortgaged"]:
                    prop_val += t.get("mortgage", 0)
                else:
                    prop_val += t.get("price", 0)
                    h = st.get("houses", 0)
                    houses_val += h * t.get("house_cost", 0)

            p_data["properties_value"] = prop_val
            p_data["houses_value"] = houses_val

            # Monopolies completed
            monopolies = []
            for g_key in COLOR_GROUPS:
                if self.has_monopoly(pid, g_key):
                    monopolies.append(g_key)
            p_data["monopolies"] = monopolies

            # Disconnect grace timer left
            if not p.get("connected", True) and p.get("disconnect_deadline"):
                p_data["disconnect_time_left"] = max(0, int(p["disconnect_deadline"] - now))
            else:
                p_data["disconnect_time_left"] = None

            players_serialized.append(p_data)

        # Include time left for turn
        now = time.time()
        # Timer pauses after playing the turn until End Turn is pressed, unless player is in negative balance
        if self.state == "PLAYING":
            curr = self.get_current_player()
            if self.turn_phase == "WAITING_END_TURN" and curr and curr["cash"] >= 0:
                time_left = 0
            else:
                time_left = max(0, int(self.turn_deadline - now))
        else:
            time_left = 0

        auction_data = None
        if self.auction:
            auction_data = dict(self.auction)
            if self.auction.get("deadline"):
                auction_data["time_left"] = max(0, round(self.auction["deadline"] - now, 1))
            else:
                auction_data["time_left"] = None

        return {
            "room_id": self.room_id,
            "host_id": self.host_id,
            "is_public": getattr(self, "is_public", False) or self.settings.get("is_public", False),
            "state": self.state,
            "settings": self.settings,
            "players": players_serialized,
            "current_player_idx": self.current_player_idx,
            "current_player_id": self.player_order[self.current_player_idx] if self.player_order else None,
            "turn_phase": self.turn_phase,
            "last_dice": self.last_dice,
            "consecutive_doubles": self.consecutive_doubles,
            "free_parking_pool": self.free_parking_pool,
            "turn_time_left": time_left,
            "turn_count": self.turn_count,
            "auction": auction_data,
            "pending_debt": self.pending_debt,
            "tile_states": self.tile_states,
            "active_trades": [t for t in self.active_trades.values() if t["status"] == "PENDING"],
            "trade_history": self.trade_history[-30:],
            "auction_history": self.auction_history[-30:],
            "chat_messages": self.chat_messages[-50:],
            "logs": self.logs[-50:]  # Recent logs
        }
