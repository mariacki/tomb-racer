"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorType_1 = __importDefault(require("./ErrorType"));
const GameError_1 = __importDefault(require("./GameError"));
class GameStartedTwice extends GameError_1.default {
    constructor(userId) {
        super(ErrorType_1.default.GAME_STARTED_TWICE, "Game started twice by a single user");
        this.userId = userId;
    }
}
exports.default = GameStartedTwice;
//# sourceMappingURL=GameStartedTwice.js.map