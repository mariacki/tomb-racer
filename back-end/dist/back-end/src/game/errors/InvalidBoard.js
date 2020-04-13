"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorType_1 = __importDefault(require("./ErrorType"));
const GameError_1 = __importDefault(require("./GameError"));
class InvalidBoard extends GameError_1.default {
    constructor() {
        super(ErrorType_1.default.INVALID_BOARD, "Given board is invalid.");
    }
}
exports.default = InvalidBoard;
//# sourceMappingURL=InvalidBoard.js.map