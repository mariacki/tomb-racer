"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../../../common/events");
const _1 = require(".");
class GameStartedTwice extends _1.GameError {
    constructor(userId, gameId) {
        super(events_1.ErrorType.GAME_STARTED_TWICE, gameId, "Game started twice by a single user");
        this.userId = userId;
    }
}
exports.GameStartedTwice = GameStartedTwice;
//# sourceMappingURL=GameStartedTwice.js.map