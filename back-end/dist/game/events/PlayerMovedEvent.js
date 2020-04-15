"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class PlayerMovedEvent {
    constructor(gameId, userId, pathUsed) {
        this.isError = false;
        this.type = tr_common_1.EventType.PLAYER_MOVED;
        this.origin = gameId;
        this.userId = userId;
        this.pathUsed = pathUsed;
    }
}
exports.PlayerMovedEvent = PlayerMovedEvent;
//# sourceMappingURL=PlayerMovedEvent.js.map