"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class PlayerDiedEvent {
    constructor(gameId, player) {
        this.isError = false;
        this.type = tr_common_1.EventType.PLAYER_MOVED;
        this.origin = gameId;
        this.userId = player.userId;
        this.movedTo = player.position;
        this.hp = player.hp;
    }
}
exports.PlayerDiedEvent = PlayerDiedEvent;
//# sourceMappingURL=PlayerDiedEvent.js.map