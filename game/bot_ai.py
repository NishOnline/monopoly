"""
Intelligent Bot AI for Richup.io
Makes realistic and competitive decisions for simulated players.
"""

import time
from typing import Dict, Any, Optional
from .board_data import BOARD_TILES, COLOR_GROUPS

BOT_NAMES = [
    "Baron Bot", "Penny Pincher", "Tycoon Tom", "Luna Cash", 
    "Atlas AI", "Capital Carl", "Monopoly Maven", "WallStreet Will"
]

class BotAI:
    def __init__(self, room):
        self.room = room
        self.last_action_time = 0
        self.action_delay = 1.0  # seconds between bot decisions for smooth natural pacing

    def tick(self) -> bool:
        """Called periodically by server tick loop. Returns True if action was performed."""
        now = time.time()
        if now - self.last_action_time < self.action_delay:
            return False

        if self.room.state != "PLAYING":
            return False

        # 1. Handle Auctions where bot is a participant
        if self.room.turn_phase == "AUCTION" and self.room.auction:
            for pid in self.room.auction["bidders"]:
                if pid not in self.room.auction["passed"]:
                    player = self.room.players.get(pid)
                    if player and player["is_bot"]:
                        if self._handle_bot_auction(player):
                            self.last_action_time = now
                            return True

        # 2. Handle Pending Trades where receiver is a bot
        for trade_id, trade in list(self.room.active_trades.items()):
            if trade["status"] == "PENDING":
                receiver = self.room.players.get(trade["receiver_id"])
                if receiver and receiver["is_bot"]:
                    self._handle_bot_trade_response(receiver, trade)
                    self.last_action_time = now
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
            if curr["jail_cards"] > 0:
                self.room.use_jail_card(curr["id"])
                self.last_action_time = now
                return True
            elif curr["cash"] >= 350:
                self.room.pay_jail_fine(curr["id"])
                self.last_action_time = now
                return True
            else:
                self.room.roll_dice(curr["id"])
                self.last_action_time = now
                return True

        # Normal Roll
        if self.room.turn_phase == "WAITING_ROLL":
            self.room.roll_dice(curr["id"])
            self.last_action_time = now
            return True

        # Buying / Declining property
        if self.room.turn_phase == "LANDED_ACTION":
            tile_id = curr["position"]
            tile = BOARD_TILES[tile_id]
            price = tile.get("price", 0)

            # Bot decides whether to buy
            should_buy = False
            # Check if completes monopoly
            group = tile.get("group")
            if group in COLOR_GROUPS:
                tiles_in_group = COLOR_GROUPS[group]["tiles"]
                owned_by_bot = sum(1 for tid in tiles_in_group if self.room.tile_states[tid]["owner"] == curr["id"])
                if owned_by_bot == len(tiles_in_group) - 1:
                    should_buy = True  # Completes monopoly!

            if curr["cash"] >= price + 100:
                should_buy = True
            elif curr["cash"] >= price and should_buy:
                should_buy = True

            if should_buy and curr["cash"] >= price:
                self.room.buy_property(curr["id"])
            else:
                self.room.decline_and_auction(curr["id"])

            self.last_action_time = now
            return True

        # End of turn actions (building, unmortgaging, ending turn)
        if self.room.turn_phase == "WAITING_END_TURN":
            # Check if bot can build houses on owned monopolies
            for group_key, grp in COLOR_GROUPS.items():
                if grp["name"] in ["Railroads", "Utilities"]:
                    continue
                if self.room.has_monopoly(curr["id"], group_key):
                    for tid in grp["tiles"]:
                        state = self.room.tile_states[tid]
                        t = BOARD_TILES[tid]
                        if state["houses"] < 5 and curr["cash"] >= t["house_cost"] + 250:
                            if self.room.build_house(curr["id"], tid):
                                self.last_action_time = now
                                return True

            # End turn
            self.room.end_turn(curr["id"])
            self.last_action_time = now
            return True

        return False

    def _handle_bot_auction(self, bot: Dict[str, Any]) -> bool:
        auction = self.room.auction
        if not auction:
            return False

        tile = BOARD_TILES[auction["tile_id"]]
        base_price = tile["price"]
        max_val = int(base_price * 1.1)

        # Check if completing monopoly
        group = tile.get("group")
        if group in COLOR_GROUPS:
            tiles_in_group = COLOR_GROUPS[group]["tiles"]
            owned = sum(1 for tid in tiles_in_group if self.room.tile_states[tid]["owner"] == bot["id"])
            if owned == len(tiles_in_group) - 1:
                max_val = int(base_price * 1.5)

        highest = auction["highest_bid"]
        if highest == 0:
            bid = min(bot["cash"], max(10, base_price // 2))
            if bid > 0:
                return self.room.place_bid(bot["id"], bid)

        if highest + 10 <= max_val and highest + 10 <= bot["cash"] - 50:
            return self.room.place_bid(bot["id"], highest + 10)
        else:
            return self.room.pass_bid(bot["id"])

    def _handle_bot_debt(self, bot: Dict[str, Any]):
        if bot["cash"] >= 0:
            if self.room.pending_debt:
                self.room.resolve_debt(bot["id"])
            return

        # 1. Try to mortgage unmonopolized properties
        for tid in list(bot["properties"]):
            state = self.room.tile_states[tid]
            if not state["mortgaged"] and state["houses"] == 0:
                tile = BOARD_TILES[tid]
                group = tile.get("group")
                if not self.room.has_monopoly(bot["id"], group):
                    self.room.mortgage_property(bot["id"], tid)
                    if bot["cash"] >= 0:
                        if self.room.pending_debt:
                            self.room.resolve_debt(bot["id"])
                        return

        # 2. Try to sell houses
        for tid in list(bot["properties"]):
            state = self.room.tile_states[tid]
            while state["houses"] > 0:
                self.room.sell_house(bot["id"], tid)
                if bot["cash"] >= 0:
                    if self.room.pending_debt:
                        self.room.resolve_debt(bot["id"])
                    return

        # 3. Mortgage any remaining properties
        for tid in list(bot["properties"]):
            state = self.room.tile_states[tid]
            if not state["mortgaged"] and state["houses"] == 0:
                self.room.mortgage_property(bot["id"], tid)
                if bot["cash"] >= 0:
                    if self.room.pending_debt:
                        self.room.resolve_debt(bot["id"])
                    return

        # 4. If still cannot pay, bankruptcy
        if bot["cash"] < 0 or (self.room.pending_debt and bot["cash"] < self.room.pending_debt["amount"]):
            self.room.declare_bankruptcy(bot["id"])
        elif self.room.pending_debt:
            self.room.resolve_debt(bot["id"])

    def _handle_bot_trade_response(self, bot: Dict[str, Any], trade: Dict[str, Any]):
        # Evaluate trade
        offer_val = trade["offer"].get("cash", 0)
        for tid in trade["offer"].get("properties", []):
            offer_val += BOARD_TILES[int(tid)]["price"]
        offer_val += trade["offer"].get("jail_cards", 0) * 50

        request_val = trade["request"].get("cash", 0)
        for tid in trade["request"].get("properties", []):
            request_val += BOARD_TILES[int(tid)]["price"]
        request_val += trade["request"].get("jail_cards", 0) * 50

        # Bot accepts if offer value >= request value * 1.1
        if offer_val >= request_val * 1.1:
            self.room.respond_to_trade(bot["id"], trade["id"], accept=True)
        else:
            self.room.respond_to_trade(bot["id"], trade["id"], accept=False)
