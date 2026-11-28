"""
Monopoly / Richup Authoritative Game Engine
Full rule-adherent implementation of Richup.io mechanics.
"""

import copy
import random
import time
import uuid
from typing import Dict, List, Optional, Any
from .board_data import BOARD_TILES, COLOR_GROUPS, CHANCE_CARDS, COMMUNITY_CARDS, MAPS

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
    "advanced_shops": True,
    "random_events": True,
    "map": "classic",
    "is_public": False,
    "bot_difficulty": "balanced",
    "game_mode": "individual"
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

        # Alliances / Teams configuration
        self.teams: Dict[str, Dict[str, Any]] = {
            "team_1": {"id": "team_1", "name": "Team Alpha", "color": "#38bdf8"},
            "team_2": {"id": "team_2", "name": "Team Omega", "color": "#f43f5e"}
        }

        # Board properties status and map configuration
        self.board_tiles: List[Dict[str, Any]] = []
        self.color_groups: Dict[str, Any] = {}
        self.jail_tile_id: int = 10
        self.vacation_tile_id: int = 20
        self.goto_jail_tile_id: int = 30
        self.tile_states: Dict[int, Dict[str, Any]] = {}
        self.set_map(self.settings.get("map", "classic"))

        # Game state tracking
        self.turn_phase = "WAITING_ROLL"  # WAITING_ROLL, LANDED_ACTION, WAITING_END_TURN, AUCTION, DEBT
        self.last_dice = [1, 1]
        self.roll_seq = 0
        self.consecutive_doubles = 0
        self.free_parking_pool = 0
        self.last_card = None
        self.pending_debt = None  # {debtor_id, creditor_id, amount}

        # Random Events cycle
        self.active_event: Optional[Dict[str, Any]] = None
        self.rounds_since_last_event = 0
        self.current_round = 1

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

    def set_map(self, map_name: str):
        map_name = (map_name or "classic").lower()
        if map_name == "standard":
            map_name = "classic"
        if map_name not in MAPS:
            map_name = "classic"
        self.settings["map"] = map_name
        cfg = MAPS[map_name]
        self.board_tiles = copy.deepcopy(cfg["tiles"])
        self.color_groups = copy.deepcopy(cfg["color_groups"])

        self.jail_tile_id = 10
        self.vacation_tile_id = 20
        self.goto_jail_tile_id = 30
        for t in self.board_tiles:
            if t["type"] == "jail":
                self.jail_tile_id = t["id"]
            elif t["type"] == "parking":
                self.vacation_tile_id = t["id"]
            elif t["type"] == "gotojail":
                self.goto_jail_tile_id = t["id"]

        if self.state == "LOBBY":
            self.tile_states = {}
            for tile in self.board_tiles:
                self.tile_states[tile["id"]] = {
                    "owner": None,
                    "houses": 0,
                    "shops": 0,
                    "mortgaged": False
                }

    def update_settings(self, new_settings: Dict[str, Any]):
        for k, v in new_settings.items():
            if k == "bot_difficulty":
                diff = str(v).lower()
                if diff in ["conscious", "balanced", "determined"]:
                    self.settings[k] = diff
            elif k == "game_mode":
                mode = str(v).lower()
                if mode in ["individual", "alliances"]:
                    self.settings[k] = mode
            elif k in self.settings:
                self.settings[k] = v
        if "map" in new_settings and self.state == "LOBBY":
            self.set_map(new_settings["map"])
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
            "disconnect_deadline": None,
            "team_id": random.choice(list(self.teams.keys())) if getattr(self, "teams", None) else "team_1"
        }

        self.players[player_id] = player
        self.player_order.append(player_id)
        self.log(f"{name} joined the room.", "lobby", "👋", player_id)
        return player

    def set_player_team(self, actor_id: str, target_player_id: str, team_id: str) -> bool:
        if self.state != "LOBBY" or actor_id != self.host_id:
            return False
        if target_player_id not in self.players or team_id not in self.teams:
            return False
        self.players[target_player_id]["team_id"] = team_id
        return True

    def rename_team(self, actor_id: str, team_id: str, new_name: str) -> bool:
        if self.state != "LOBBY":
            return False
        actor = self.players.get(actor_id)
        if not actor or actor.get("team_id") != team_id or team_id not in self.teams:
            return False
        clean_name = str(new_name).strip()[:24]
        if not clean_name:
            return False
        self.teams[team_id]["name"] = clean_name
        return True

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
        self.roll_seq += 1
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
        board_len = len(self.board_tiles)
        new_pos = (old_pos + steps) % board_len
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
        board_len = len(self.board_tiles)
        if is_double:
            player["in_jail"] = False
            player["jail_turns"] = 0
            self.consecutive_doubles = 0
            self.log(f"{player['name']} rolled doubles ({d1}, {d2}) and escaped Jail!", "jail", "🔓", player["id"])
            steps = d1 + d2
            player["position"] = (self.jail_tile_id + steps) % board_len
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
                    player["position"] = (self.jail_tile_id + steps) % board_len
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
                    player["position"] = (self.jail_tile_id + steps) % board_len
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
        self.turn_phase = "WAITING_END_TURN"
        self.log(f"{curr['name']} paid $50 fine to get out of prison. That counts as their turn (no roll).", "jail", "💸", curr["id"])
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
        player["position"] = self.jail_tile_id
        player["in_jail"] = True
        player["jail_turns"] = 0
        self.consecutive_doubles = 0
        self.turn_phase = "WAITING_END_TURN"

    def _process_tile_landing(self, player: Dict[str, Any], tile_id: int, steps: int, is_double: bool) -> Dict[str, Any]:
        tile = self.board_tiles[tile_id]
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
                elif (
                    self.settings.get("game_mode", "individual") == "alliances"
                    and player.get("team_id")
                    and player.get("team_id") == owner.get("team_id")
                ):
                    self.turn_phase = "WAITING_END_TURN"
                    res["action"] = "teammate_no_rent"
                    team_name = self.teams.get(player["team_id"], {}).get("name", "Alliance")
                    self.log(f"🤝 {player['name']} landed on teammate {owner['name']}'s {tile_name} ({team_name}). No rent owed!", "rent", "🤝", player["id"])
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
            player["vacation_skip"] = True
            if self.settings["free_parking_jackpot"] and self.free_parking_pool > 0:
                jackpot = self.free_parking_pool
                player["cash"] += jackpot
                self.free_parking_pool = 0
                self.log(f"{player['name']} landed on Vacation, collected ${jackpot} Tax Pool, and will skip next turn!", "jackpot", "🌴", player["id"])
                res["action"] = "won_jackpot"
                res["jackpot"] = jackpot
            else:
                self.log(f"{player['name']} is relaxing on Vacation! Their next turn will be skipped.", "parking", "🌴", player["id"])
                res["action"] = "free_parking"
            self.turn_phase = "WAITING_END_TURN"

        elif tile_type == "gotojail":
            self.log(f"{player['name']} landed on Go to prison!", "jail", "⛓️", player["id"])
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
        tile = self.board_tiles[tile_id]
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
        group_info = self.color_groups.get(group_key)

        if tile_type == "property":
            houses = state["houses"]
            base_rent = tile["rent"][houses]
            if houses == 0 and self.has_monopoly(owner_id, group_key) and self.settings.get("double_rent_full_set", True):
                rent = base_rent * 2
            else:
                rent = base_rent
            # Event modifier: URBAN_INFLATION (+25% rent on properties)
            if self.active_event and self.active_event.get("id") == "URBAN_INFLATION":
                rent = int(rent * 1.25)
            return rent

        elif tile_type == "railroad":
            owned_railroads = sum(1 for tid in group_info["tiles"] if self.tile_states[tid]["owner"] == owner_id)
            rent = tile["rent"][min(owned_railroads - 1, 3)]
            # Event modifier: TOURISM_SURGE (2x rent on transit/utilities)
            if self.active_event and self.active_event.get("id") == "TOURISM_SURGE":
                rent = int(rent * 2)
            return rent

        elif tile_type == "utility":
            owned_utilities = sum(1 for tid in group_info["tiles"] if self.tile_states[tid]["owner"] == owner_id)
            multiplier = 15 if owned_utilities >= 3 else (10 if owned_utilities == 2 else 4)
            rent = dice_roll * multiplier
            # Event modifier: TOURISM_SURGE (2x rent on transit/utilities)
            if self.active_event and self.active_event.get("id") == "TOURISM_SURGE":
                rent = int(rent * 2)
            return rent

        return 0

    def has_monopoly(self, player_id: str, group_key: str) -> bool:
        if group_key not in self.color_groups:
            return False
        tiles = self.color_groups[group_key]["tiles"]
        return all(self.tile_states[tid]["owner"] == player_id for tid in tiles)

    def _format_card_desc_for_player(self, card: Dict[str, Any], player_name: str) -> str:
        cid = card.get("id", "")
        amt = card.get("amount", 0)

        # Community Chest
        if cid == "cc_go":
            return f"{player_name} advanced to START and collected $200 salary!"
        elif cid == "cc_bank_error":
            return f"Bank error in {player_name}'s favor! Collected $200."
        elif cid == "cc_doctor":
            return f"Doctor's fee: {player_name} paid $50."
        elif cid == "cc_stock":
            return f"Stock sale! {player_name} collected $50."
        elif cid == "cc_jail_free":
            return f"{player_name} received a Get Out of Jail Free card."
        elif cid == "cc_goto_jail":
            return f"{player_name} went directly to prison!"
        elif cid == "cc_holiday":
            return f"Holiday fund matured! {player_name} received $100."
        elif cid == "cc_tax_refund":
            return f"Income tax refund! {player_name} collected $20."
        elif cid == "cc_birthday":
            return f"It is {player_name}'s birthday! Collected $10 from each player."
        elif cid == "cc_life_insurance":
            return f"Life insurance matured! {player_name} collected $100."
        elif cid == "cc_hospital":
            return f"Hospital fees: {player_name} paid $100."
        elif cid == "cc_school":
            return f"School tuition: {player_name} paid $50."
        elif cid == "cc_consultancy":
            return f"{player_name} received $25 consultancy fee."
        elif cid == "cc_street_repairs":
            return f"{player_name} was assessed for street repairs ($40/house, $115/hotel)."
        elif cid == "cc_beauty":
            return f"{player_name} won second prize in a beauty contest! Collected $10."
        elif cid == "cc_inherit":
            return f"{player_name} inherited $100!"

        # Chance
        elif cid == "ch_go":
            return f"{player_name} advanced to START and collected $200 salary!"
        elif cid == "ch_new_york":
            return f"{player_name} advanced to New York!"
        elif cid == "ch_london":
            return f"{player_name} advanced to London!"
        elif cid == "ch_shanghai":
            return f"{player_name} advanced to Shanghai!"
        elif cid == "ch_railroad":
            return f"{player_name} flew to the nearest Airport!"
        elif cid == "ch_utility":
            return f"{player_name} advanced to the nearest Utility!"
        elif cid == "ch_dividend":
            return f"Bank dividend! {player_name} collected $50."
        elif cid == "ch_jail_free":
            return f"{player_name} received a Get Out of Jail Free card."
        elif cid == "ch_back_3":
            return f"{player_name} stepped back 3 spaces."
        elif cid == "ch_goto_jail":
            return f"{player_name} went directly to prison!"
        elif cid == "ch_repairs":
            return f"{player_name} made property repairs ($25/house, $100/hotel)."
        elif cid == "ch_speeding":
            return f"Speeding fine! {player_name} paid $15."
        elif cid == "ch_chairman":
            return f"{player_name} was elected Chairman of the Board! Paid each player $50."
        elif cid == "ch_building_loan":
            return f"{player_name}'s building loan matured! Collected $150."

        # Generic action fallback
        action = card.get("action")
        if action == "collect":
            return f"{player_name} collected ${amt}!"
        elif action == "pay":
            return f"{player_name} paid ${amt}."
        elif action == "collect_each":
            return f"{player_name} collected ${amt} from each player."
        elif action == "pay_each":
            return f"{player_name} paid each player ${amt}."

        desc = card.get("desc", "")
        desc = desc.replace("You won", f"{player_name} won")
        desc = desc.replace("You have won", f"{player_name} won")
        desc = desc.replace("you get", f"{player_name} gets")
        desc = desc.replace("You inherit", f"{player_name} inherits")
        desc = desc.replace("your favor", f"{player_name}'s favor")
        desc = desc.replace("Your building", f"{player_name}'s building")
        desc = desc.replace("your property", f"{player_name}'s property")
        desc = desc.replace("You are", f"{player_name} was")
        desc = desc.replace("You have", f"{player_name} was")
        desc = desc.replace("Advance to", f"{player_name} advances to")
        return desc

    def _draw_card(self, player: Dict[str, Any], deck_type: str) -> Dict[str, Any]:
        deck = self.chance_deck if deck_type == "chance" else self.community_deck
        if not deck:
            refill = copy.deepcopy(CHANCE_CARDS if deck_type == "chance" else COMMUNITY_CARDS)
            random.shuffle(refill)
            deck.extend(refill)

        card = deck.pop(0)
        initial_pos = player["position"]
        formatted_desc = self._format_card_desc_for_player(card, player["name"])
        self.last_card = {
            "id": str(uuid.uuid4())[:8],
            "type": deck_type,
            "title": card["title"],
            "desc": formatted_desc,
            "player_name": player["name"]
        }
        self.log(f"{player['name']} drew {card['title']}: {formatted_desc}", "card", "🎴", player["id"])

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
            target = card.get("target", 0)
            target_name = card.get("target_name")
            if target_name:
                for t in self.board_tiles:
                    if t.get("name") == target_name:
                        target = t["id"]
                        break
            if target < old_pos and target != self.jail_tile_id:  # Passed GO
                salary = self.settings["go_salary"]
                player["cash"] += salary
                self.log(f"{player['name']} passed GO and collected ${salary}!", "money", "💵", player["id"])
            player["position"] = target
            self.last_card["intermediate_tile"] = initial_pos
            self.last_card["destination_tile"] = target
            self._process_tile_landing(player, target, 7, False)

        elif action == "move_steps":
            steps = card["steps"]
            target = (player["position"] + steps) % len(self.board_tiles)
            player["position"] = target
            self.last_card["intermediate_tile"] = initial_pos
            self.last_card["destination_tile"] = target
            self._process_tile_landing(player, target, 7, False)

        elif action == "nearest_railroad":
            railroads = [t["id"] for t in self.board_tiles if t["type"] == "railroad"]
            pos = player["position"]
            board_len = len(self.board_tiles)
            nearest = min(railroads, key=lambda r: (r - pos) % board_len) if railroads else pos
            if nearest < pos:
                player["cash"] += self.settings["go_salary"]
            player["position"] = nearest
            self.last_card["intermediate_tile"] = initial_pos
            self.last_card["destination_tile"] = nearest
            self._process_tile_landing(player, nearest, 7, False)

        elif action == "nearest_utility":
            utilities = [t["id"] for t in self.board_tiles if t["type"] == "utility"]
            pos = player["position"]
            board_len = len(self.board_tiles)
            nearest = min(utilities, key=lambda u: (u - pos) % board_len) if utilities else pos
            if nearest < pos:
                player["cash"] += self.settings["go_salary"]
            player["position"] = nearest
            self.last_card["intermediate_tile"] = initial_pos
            self.last_card["destination_tile"] = nearest
            self._process_tile_landing(player, nearest, 7, False)

        elif action == "jail_free":
            player["jail_cards"] += 1
            self.turn_phase = "WAITING_END_TURN"

        elif action == "goto_jail":
            self.last_card["intermediate_tile"] = initial_pos
            self.last_card["destination_tile"] = self.jail_tile_id
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
        tile = self.board_tiles[tile_id]
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
        tile = self.board_tiles[tile_id]
        self.log(f"{curr['name']} put {tile['name']} up for Public Auction!", "auction", "⚖️", curr["id"])
        self.start_auction(tile_id)
        return True

    def pass_property(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id or self.turn_phase != "LANDED_ACTION":
            return False
        tile_id = curr["position"]
        tile = self.board_tiles[tile_id]
        self.log(f"{curr['name']} decided not to buy {tile['name']}.", "property", "⏭️", curr["id"])
        self.turn_phase = "WAITING_END_TURN"
        return True

    def decline_and_auction(self, player_id: str) -> bool:
        curr = self.get_current_player()
        if curr["id"] != player_id or self.turn_phase != "LANDED_ACTION":
            return False

        tile_id = curr["position"]
        tile = self.board_tiles[tile_id]

        if self.settings.get("auction_on_decline", True):
            self.log(f"{curr['name']} opted to auction {tile['name']}.", "auction", "⚖️", curr["id"])
            self.start_auction(tile_id)
        else:
            self.log(f"{curr['name']} passed on buying {tile['name']}.", "property", "⏭️", curr["id"])
            self.turn_phase = "WAITING_END_TURN"
        return True

    def start_auction(self, tile_id: int):
        tile = self.board_tiles[tile_id]
        bidders = [p["id"] for p in self.players.values() if not p["is_bankrupt"]]
        self.auction = {
            "tile_id": tile_id,
            "tile_name": tile["name"],
            "price": tile["price"],
            "highest_bid": 0,
            "highest_bidder": None,
            "bidders": bidders,
            "passed": [],
            "deadline": time.time() + 15.0  # 15s initial window to place first bid; concludes as unsold if expired
        }
        self.turn_phase = "AUCTION"
        self.log(f"Public Auction started for {tile['name']}! (15s to place bids)", "auction", "⚖️")

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
        # Auctions countdown 5s after each bid to give players time to respond
        self.auction["deadline"] = time.time() + 5.0

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

        # Check if only 1 bidder left or all passed (filtering out any players who became bankrupt)
        active_left = [b for b in self.auction["bidders"] if b not in self.auction["passed"] and not self.players.get(b, {}).get("is_bankrupt")]
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
        tile = self.board_tiles[tile_id]
        state = self.tile_states[tile_id]

        if winner_id and self.auction["highest_bid"] > 0:
            winner = self.players[winner_id]
            bid = self.auction["highest_bid"]
            winner["cash"] -= bid
            state["owner"] = winner_id
            winner["properties"].append(tile_id)
            self.log(f"Auction won by {winner['name']} for ${bid}!", "auction", "🏆", winner_id)
            if winner["cash"] < 0:
                self.log(f"⚠️ {winner['name']} has a negative balance (${winner['cash']}) after auction! Must liquidate before ending turn.", "debt", "⚠️", winner_id)
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
        if self.turn_phase == "LANDED_ACTION":
            self.pass_property(player_id)
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
        old_idx = self.current_player_idx
        # Move index to next non-bankrupt player, skipping any player whose turn is skipped due to Vacation
        attempts = 0
        max_attempts = max(1, len(self.player_order) * 2)
        while attempts < max_attempts:
            self.current_player_idx = (self.current_player_idx + 1) % len(self.player_order)
            next_player = self.players[self.player_order[self.current_player_idx]]
            if next_player["is_bankrupt"]:
                attempts += 1
                continue
            if next_player.get("vacation_skip"):
                next_player["vacation_skip"] = False
                self.log(f"🌴 {next_player['name']} is relaxing on Vacation! Turn skipped.", "turn", "🌴", next_player["id"])
                attempts += 1
                continue
            break

        self.turn_count += 1
        self.turn_phase = "WAITING_ROLL"
        self.reset_turn_timer()

        # Check round progression (wrapped around to start of order)
        if self.current_player_idx <= old_idx:
            self.current_round += 1
            self.rounds_since_last_event += 1

            # Decrement active event duration
            if self.active_event:
                self.active_event["remaining_rounds"] -= 1
                if self.active_event["remaining_rounds"] <= 0:
                    exp_name = self.active_event["name"]
                    self.active_event = None
                    self.log(f"Market Event Concluded: {exp_name} has ended.", "event", "🔔")

            # Check for new random event trigger (every 4-6 rounds)
            if self.settings.get("random_events", True) and not self.active_event:
                if self.rounds_since_last_event >= 4:
                    self._trigger_random_event()

        # Check win condition
        active_players = [p for p in self.players.values() if not p["is_bankrupt"]]
        if len(active_players) <= 1:
            self._handle_game_won(active_players[0] if active_players else None)
            return

        curr = self.get_current_player()
        self.log(f"Turn {self.turn_count}: {curr['name']}'s turn.", "turn", "⏳", curr["id"])

    def _trigger_random_event(self):
        self.rounds_since_last_event = 0
        events = [
            {
                "id": "REAL_ESTATE_BOOM",
                "name": "Real Estate Boom",
                "emoji": "📈",
                "description": "Property market surges! Mortgage borrowing power increased by +50% for 3 rounds.",
                "duration": 3
            },
            {
                "id": "MARKET_CORRECTION",
                "name": "Economic Stimulus",
                "emoji": "💵",
                "description": "Federal stimulus! All active players receive a $100 cash grant from the reserve.",
                "duration": 1
            },
            {
                "id": "URBAN_INFLATION",
                "name": "Urban Inflation",
                "emoji": "💸",
                "description": "Inflation spikes! All property rents increased by 25% for 3 rounds.",
                "duration": 3
            },
            {
                "id": "TOURISM_SURGE",
                "name": "Tourism Surge",
                "emoji": "✈️",
                "description": "Tourism is booming! All Airports and Utilities collect 2x income for 3 rounds.",
                "duration": 3
            },
            {
                "id": "TAX_REFORMS",
                "name": "Wealth Equity Levy",
                "emoji": "🏛️",
                "description": "Tax reform! The wealthiest player contributes $150 to the Vacation Jackpot pool.",
                "duration": 1
            }
        ]
        ev = random.choice(events)
        self.active_event = {
            "id": ev["id"],
            "name": ev["name"],
            "emoji": ev["emoji"],
            "description": ev["description"],
            "remaining_rounds": ev["duration"]
        }

        # Immediate effects
        if ev["id"] == "MARKET_CORRECTION":
            for p in self.players.values():
                if not p["is_bankrupt"]:
                    p["cash"] += 100
        elif ev["id"] == "TAX_REFORMS":
            richest = max((p for p in self.players.values() if not p["is_bankrupt"]), key=lambda p: p["cash"], default=None)
            if richest and richest["cash"] > 0:
                tax_amt = min(150, richest["cash"])
                richest["cash"] -= tax_amt
                self.free_parking_pool += tax_amt
                self.log(f"{richest['name']} paid ${tax_amt} Wealth Tax into the Vacation pool.", "tax", "🏛️", richest["id"])

        self.log(f"⚡ RANDOM EVENT: {ev['emoji']} {ev['name']}! {ev['description']}", "event", ev["emoji"])

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
            state["shops"] = 0
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
        curr_p = self.get_current_player()
        if not curr_p or curr_p["id"] != player_id:
            return ActionResult(False, "Houses and hotels can only be built during your own turn.")

        player = self.players.get(player_id)
        tile = self.board_tiles[tile_id]
        state = self.tile_states[tile_id]

        if not player:
            return ActionResult(False, "Player not found.")
        if state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if tile["type"] != "property":
            return ActionResult(False, "You can only build houses on color properties (not stations or utilities).")

        group_key = tile["group"]
        if not self.has_monopoly(player_id, group_key):
            grp_name = self.color_groups[group_key].get("name", group_key).title()
            return ActionResult(False, f"Monopoly Required: You must own all properties in the {grp_name} color set before building houses.")

        group_tiles = self.color_groups[group_key]["tiles"]
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
        tile = self.board_tiles[tile_id]
        state = self.tile_states[tile_id]

        if not player or state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if state["houses"] <= 0:
            return ActionResult(False, "There are no houses to sell on this property.")

        group_key = tile["group"]
        group_tiles = self.color_groups[group_key]["tiles"]

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

    def get_property_mortgage_value(self, tile_id: int) -> int:
        tile = self.board_tiles[tile_id]
        state = self.tile_states[tile_id]
        base_mortgage = tile.get("mortgage", 0)
        # Advanced shops boost mortgage borrowing value by 60% of shop cost
        if state.get("shops", 0) > 0:
            base_mortgage += int(tile.get("house_cost", 100) * 0.6)
        # Real Estate Boom event: +50% mortgage borrowing power
        if self.active_event and self.active_event.get("id") == "REAL_ESTATE_BOOM":
            base_mortgage = int(base_mortgage * 1.5)
        return base_mortgage

    def mortgage_property(self, player_id: str, tile_id: int) -> ActionResult:
        if not self.settings.get("mortgage_enabled", True):
            return ActionResult(False, "Mortgaging properties is disabled in this room.")
        player = self.players.get(player_id)
        tile = self.board_tiles[tile_id]
        state = self.tile_states[tile_id]

        if not player or state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if state["mortgaged"]:
            return ActionResult(False, "This property is already mortgaged.")

        if tile["type"] == "property":
            group_tiles = self.color_groups[tile["group"]]["tiles"]
            # Note: shops do NOT prevent mortgaging (per user spec: properties with shops can be mortgaged without destroying or selling shops)
            if any(self.tile_states[tid]["houses"] > 0 for tid in group_tiles):
                return ActionResult(False, "Cannot Mortgage: You must sell all houses/hotels across this entire color set before mortgaging any property in it.")

        val = self.get_property_mortgage_value(tile_id)
        state["mortgaged"] = True
        player["cash"] += val
        shop_note = " (includes shop boost)" if state.get("shops", 0) > 0 else ""
        self.log(f"{player['name']} mortgaged {tile['name']}{shop_note} for ${val}.", "mortgage", "📑", player_id)
        return ActionResult(True, f"Successfully mortgaged {tile['name']} for ${val}.")

    def unmortgage_property(self, player_id: str, tile_id: int) -> ActionResult:
        player = self.players.get(player_id)
        tile = self.board_tiles[tile_id]
        state = self.tile_states[tile_id]

        if not player or state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if not state["mortgaged"]:
            return ActionResult(False, "This property is not currently mortgaged.")

        val = self.get_property_mortgage_value(tile_id)
        cost = int(val * 1.1)
        if player["cash"] < cost:
            return ActionResult(False, f"Insufficient Cash: Unmortgaging costs ${cost} (principal + 10% interest), but your balance is only ${player['cash']}.")

        player["cash"] -= cost
        state["mortgaged"] = False
        self.log(f"{player['name']} unmortgaged {tile['name']} for ${cost}.", "mortgage", "🔑", player_id)
        return ActionResult(True, f"Successfully unmortgaged {tile['name']}.")

    def build_shop(self, player_id: str, tile_id: int) -> ActionResult:
        if not self.settings.get("advanced_shops", True):
            return ActionResult(False, "Advanced Shops are disabled in this room.")
        player = self.players.get(player_id)
        tile = self.board_tiles[tile_id]
        state = self.tile_states[tile_id]

        if not player:
            return ActionResult(False, "Player not found.")
        if state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if tile["type"] != "property":
            return ActionResult(False, "Advanced shops can only be built on street color properties.")
        if state.get("shops", 0) >= 1:
            return ActionResult(False, "Maximum Limit Reached: A shop is already built on this property.")

        cost = tile.get("house_cost", 100)
        if player["cash"] < cost:
            return ActionResult(False, f"Insufficient Cash: Building a shop costs ${cost}, but your balance is only ${player['cash']}.")

        player["cash"] -= cost
        state["shops"] = 1
        mort_boost = int(cost * 0.6)
        self.log(f"{player['name']} built an Advanced Shop 🏪 on {tile['name']} for ${cost} (+${mort_boost} mortgage value).", "build", "🏪", player_id)
        return ActionResult(True, f"Successfully built an Advanced Shop on {tile['name']}.")

    def sell_shop(self, player_id: str, tile_id: int) -> ActionResult:
        if not self.settings.get("advanced_shops", True):
            return ActionResult(False, "Advanced Shops are disabled in this room.")
        player = self.players.get(player_id)
        tile = self.board_tiles[tile_id]
        state = self.tile_states[tile_id]

        if not player or state["owner"] != player_id:
            return ActionResult(False, "You do not own this property.")
        if state.get("shops", 0) <= 0:
            return ActionResult(False, "There is no shop to sell on this property.")

        refund = tile.get("house_cost", 100) // 2
        state["shops"] = 0
        player["cash"] += refund
        self.log(f"{player['name']} sold the shop on {tile['name']} for ${refund}.", "sell", "🏪", player_id)
        return ActionResult(True, f"Successfully sold the shop on {tile['name']} for ${refund}.")

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
        offer_cash = max(0, int(offer.get("cash", 0)))
        offer["cash"] = offer_cash
        if offer_cash > max(0, sender["cash"]) or offer.get("jail_cards", 0) > sender.get("jail_cards", 0):
            self.last_trade_error = f"Cannot offer ${offer_cash}: Insufficient cash balance." if offer_cash > max(0, sender["cash"]) else "Cannot offer more Jail cards than you hold."
            return None
        for tid in offer_props:
            if tid not in self.tile_states or self.tile_states[tid]["owner"] != sender_id:
                self.last_trade_error = "You do not own all properties in your offer."
                return None
            # Must have 0 houses on entire color group
            t = self.board_tiles[tid]
            if t["type"] == "property":
                grp_tiles = self.color_groups.get(t.get("group", ""), {}).get("tiles", [])
                if any(self.tile_states[ot]["houses"] > 0 for ot in grp_tiles):
                    self.last_trade_error = f"Cannot trade {t['name']}: You cannot trade properties with houses or hotels on their color group. Sell all houses first."
                    return None

        # Validate request
        request_cash = max(0, int(request.get("cash", 0)))
        request["cash"] = request_cash
        if request_cash > max(0, receiver["cash"]) or request.get("jail_cards", 0) > receiver.get("jail_cards", 0):
            self.last_trade_error = f"{receiver['name']} does not have enough cash (${request_cash}) to accept this deal." if request_cash > max(0, receiver["cash"]) else f"{receiver['name']} does not hold enough Jail cards."
            return None
        for tid in request_props:
            if tid not in self.tile_states or self.tile_states[tid]["owner"] != receiver_id:
                self.last_trade_error = f"{receiver['name']} does not own all requested properties."
                return None
            t = self.board_tiles[tid]
            if t["type"] == "property":
                grp_tiles = self.color_groups.get(t.get("group", ""), {}).get("tiles", [])
                if any(self.tile_states[ot]["houses"] > 0 for ot in grp_tiles):
                    self.last_trade_error = f"Cannot request {t['name']}: Its color group has houses or hotels built on it."
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
        offer_cash = max(0, int(offer.get("cash", 0)))
        request_cash = max(0, int(request.get("cash", 0)))
        if offer_cash > max(0, sender["cash"]) or request_cash > max(0, receiver["cash"]):
            trade["status"] = "CANCELLED"
            trade["resolved_at"] = time.time()
            self.trade_history.append(trade.copy())
            self.active_trades.pop(trade_id, None)
            self.log(f"Trade between {sender['name']} and {receiver['name']} cancelled due to insufficient funds.", "trade", "⚠️")
            return False

        # Execute exchange
        sender_prev_cash = sender["cash"]
        receiver_prev_cash = receiver["cash"]
        sender["cash"] += request_cash - offer_cash
        receiver["cash"] += offer_cash - request_cash

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

        if sender_prev_cash < 0 and sender["cash"] >= 0:
            self.log(f"🎉 {sender['name']} cleared their debt by trading properties to {receiver['name']} for ${request_cash}!", "money", "✅", sender["id"])
        elif receiver_prev_cash < 0 and receiver["cash"] >= 0:
            self.log(f"🎉 {receiver['name']} cleared their debt by trading properties to {sender['name']} for ${offer_cash}!", "money", "✅", receiver["id"])
        else:
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
        if new_trade_id in self.active_trades:
            self.active_trades[new_trade_id]["is_counter"] = True

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
            tile = self.board_tiles[tid]
            state = self.tile_states[tid]
            if state["mortgaged"]:
                nw += tile.get("mortgage", 0)
            else:
                nw += tile.get("price", 0)
                houses = state.get("houses", 0)
                nw += houses * (tile.get("house_cost", 0) // 2)
                if state.get("shops", 0) > 0:
                    nw += tile.get("house_cost", 0) // 2
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
                t = self.board_tiles[tid]
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
            for g_key in self.color_groups:
                if self.has_monopoly(pid, g_key):
                    monopolies.append(g_key)
            p_data["monopolies"] = monopolies

            # Disconnect grace timer left
            if not p.get("connected", True) and p.get("disconnect_deadline"):
                p_data["disconnect_time_left"] = max(0, int(p["disconnect_deadline"] - now))
            else:
                p_data["disconnect_time_left"] = None

            players_serialized.append(p_data)

        # Include time left for turn - continues until player ends turn
        now = time.time()
        if self.state == "PLAYING":
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
            "teams": getattr(self, "teams", {}),
            "players": players_serialized,
            "current_player_idx": self.current_player_idx,
            "current_player_id": self.player_order[self.current_player_idx] if self.player_order else None,
            "turn_phase": self.turn_phase,
            "last_dice": self.last_dice,
            "roll_seq": self.roll_seq,
            "consecutive_doubles": self.consecutive_doubles,
            "free_parking_pool": self.free_parking_pool,
            "last_card": self.last_card,
            "turn_time_left": time_left,
            "turn_count": self.turn_count,
            "current_round": getattr(self, "current_round", 1),
            "active_event": getattr(self, "active_event", None),
            "auction": auction_data,
            "pending_debt": self.pending_debt,
            "tile_states": self.tile_states,
            "active_trades": [t for t in self.active_trades.values() if t["status"] == "PENDING"],
            "trade_history": self.trade_history[-30:],
            "auction_history": self.auction_history[-30:],
            "chat_messages": self.chat_messages[-50:],
            "logs": self.logs[-50:]  # Recent logs
        }
