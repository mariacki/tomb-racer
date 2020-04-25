"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
class PlayerDiedEvent {
    constructor(gameId, player) {
        this.isError = false;
        this.type = common_1.EventType.PLAYER_DIED;
        this.origin = gameId;
        this.userId = player.userId;
        this.movedTo = player.position;
        this.hp = player.hp;
    }
}
exports.PlayerDiedEvent = PlayerDiedEvent;
//# sourceMappingURL=PlayerDiedEvent.js.map