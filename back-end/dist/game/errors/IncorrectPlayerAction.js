"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameError_1 = __importDefault(require("./GameError"));
const ErrorType_1 = __importDefault(require("./ErrorType"));
class IncorrectPlayerAction extends GameError_1.default {
    constructor(gameId, userThatShouldPlay, userThatTriedToPlay) {
        super(ErrorType_1.default.INCORRECT_PLAYER_ACTION, "Inorrect Player Action");
        this.gameId = gameId;
        this.userThatShouldPlay = userThatShouldPlay;
        this.userThatTriedToPlay = userThatTriedToPlay;
    }
}
exports.default = IncorrectPlayerAction;
//# sourceMappingURL=IncorrectPlayerAction.js.map