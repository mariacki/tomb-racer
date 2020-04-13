"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameError_1 = __importDefault(require("./GameError"));
const ErrorType_1 = __importDefault(require("./ErrorType"));
class InvalidPath extends GameError_1.default {
    constructor(message) {
        super(ErrorType_1.default.INVALID_PATH, message);
    }
}
exports.default = InvalidPath;
//# sourceMappingURL=InvalidPath.js.map