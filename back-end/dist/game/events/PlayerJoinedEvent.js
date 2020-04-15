"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class PlayerJoinedEvent {
    constructor(gameId, player) {
        this.isError = false;
        this.type = tr_common_1.EventType.PLAYER_JOINED;
        this.origin = gameId;
        this.player = player;
    }
}
exports.PlayerJoinedEvent = PlayerJoinedEvent;
//# sourceMappingURL=PlayerJoinedEvent.js.map