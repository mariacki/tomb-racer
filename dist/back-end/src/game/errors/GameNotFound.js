"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const GameError_1 = require("./GameError");
class GameNotFound extends GameError_1.GameError {
    constructor(gameId) {
        super(common_1.ErrorType.GAME_NOT_FOUND, gameId, "Could not found game");
        this.gameId = gameId;
    }
}
exports.GameNotFound = GameNotFound;
//# sourceMappingURL=GameNotFound.js.map