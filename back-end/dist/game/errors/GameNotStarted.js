"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
const _1 = require(".");
class GameNotStarted extends _1.GameError {
    constructor(gameId) {
        super(tr_common_1.ErrorType.GAME_NOT_STARTED_YET, gameId, "Game not started yet");
    }
}
exports.GameNotStarted = GameNotStarted;
//# sourceMappingURL=GameNotStarted.js.map