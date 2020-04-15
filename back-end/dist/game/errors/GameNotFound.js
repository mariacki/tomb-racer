"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
const GameError_1 = __importDefault(require("./GameError"));
class GameNotFound extends GameError_1.default {
    constructor(gameId) {
        super(tr_common_1.ErrorType.GAME_NOT_FOUND, undefined, "Could not found game");
        this.gameId = gameId;
    }
}
exports.GameNotFound = GameNotFound;
//# sourceMappingURL=GameNotFound.js.map