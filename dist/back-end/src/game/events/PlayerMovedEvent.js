"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
class PlayerMovedEvent {
    constructor(gameId, userId, pathUsed) {
        this.isError = false;
        this.type = common_1.EventType.PLAYER_MOVED;
        this.origin = gameId;
        this.userId = userId;
        this.pathUsed = pathUsed;
    }
}
exports.PlayerMovedEvent = PlayerMovedEvent;
//# sourceMappingURL=PlayerMovedEvent.js.map