"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
class PlayerJoinedEvent {
    constructor(gameId, player) {
        this.isError = false;
        this.type = common_1.EventType.PLAYER_JOINED;
        this.origin = gameId;
        this.player = player;
    }
}
exports.PlayerJoinedEvent = PlayerJoinedEvent;
//# sourceMappingURL=PlayerJoinedEvent.js.map