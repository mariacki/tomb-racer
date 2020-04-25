"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
class PlayerLeftEvent {
    constructor(userId, gameId) {
        this.isError = false;
        this.type = common_1.EventType.PLAYER_LEFT;
        this.origin = gameId;
        this.userId = userId;
    }
}
exports.PlayerLeftEvent = PlayerLeftEvent;
//# sourceMappingURL=PlayerLeftEvent.js.map