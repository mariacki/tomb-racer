"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorType_1 = __importDefault(require("./ErrorType"));
const GameError_1 = __importDefault(require("./GameError"));
class GameNotStarted extends GameError_1.default {
    constructor(gameId) {
        super(ErrorType_1.default.GAME_NOT_STARTED_YET, "Game not started yet");
        this.gameId = gameId;
    }
}
exports.default = GameNotStarted;
//# sourceMappingURL=GameNotStarted.js.map