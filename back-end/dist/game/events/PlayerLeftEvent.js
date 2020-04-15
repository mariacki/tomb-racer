"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class PlayerLeftEvent {
    constructor(userId, gameId) {
        this.isError = false;
        this.type = tr_common_1.EventType.PLAYER_LEFT;
        this.origin = gameId;
        this.userId = userId;
    }
}
exports.PlayerLeftEvent = PlayerLeftEvent;
//# sourceMappingURL=PlayerLeftEvent.js.map