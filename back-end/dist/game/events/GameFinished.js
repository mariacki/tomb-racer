"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class GameFinishedEvent {
    constructor(gameId, userId) {
        this.isError = false;
        this.type = tr_common_1.EventType.GAME_FINISHED;
        this.origin = gameId;
        this.userId = userId;
    }
}
exports.GameFinishedEvent = GameFinishedEvent;
//# sourceMappingURL=GameFinished.js.map