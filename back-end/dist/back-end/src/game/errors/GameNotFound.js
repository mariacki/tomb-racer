"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorType_1 = __importDefault(require("./ErrorType"));
const GameError_1 = __importDefault(require("./GameError"));
class GameNotFound extends GameError_1.default {
    constructor(gameId) {
        super(ErrorType_1.default.GAME_NOT_FOUND, "Could not found game");
        this.gameId = gameId;
    }
}
exports.default = GameNotFound;
//# sourceMappingURL=GameNotFound.js.map