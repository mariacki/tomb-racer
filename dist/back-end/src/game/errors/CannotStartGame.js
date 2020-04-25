"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const GameError_1 = require("./GameError");
class CannotStartGame extends GameError_1.GameError {
    constructor(reason) {
        super(common_1.ErrorType.CANNOT_START_GAME, undefined, "Cannot start game");
        this.reason = reason;
    }
}
exports.CannotStartGame = CannotStartGame;
//# sourceMappingURL=CannotStartGame.js.map