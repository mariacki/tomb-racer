"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameError_1 = __importDefault(require("./GameError"));
const ErrorType_1 = __importDefault(require("./ErrorType"));
class CannotStartGame extends GameError_1.default {
    constructor(reason) {
        super(ErrorType_1.default.CANNOT_START_GAME, "Cannot Start Game");
        this.reason = reason;
    }
}
exports.default = CannotStartGame;
//# sourceMappingURL=CannotStartGame.js.map