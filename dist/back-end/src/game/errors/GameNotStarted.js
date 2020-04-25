"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const _1 = require(".");
class GameNotStarted extends _1.GameError {
    constructor(gameId) {
        super(common_1.ErrorType.GAME_NOT_STARTED_YET, gameId, "Game not started yet");
    }
}
exports.GameNotStarted = GameNotStarted;
//# sourceMappingURL=GameNotStarted.js.map