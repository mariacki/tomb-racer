"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class PlayerHitEvent {
    constructor(gameId, userId, hpTaken, currentHp) {
        this.isError = false;
        this.type = tr_common_1.EventType.PLAYER_HIT;
        this.origin = gameId;
        this.userId = userId;
        this.hpTaken = hpTaken;
        this.currentHp = currentHp;
    }
}
exports.PlayerHitEvent = PlayerHitEvent;
//# sourceMappingURL=PlayerHitEvent.js.map