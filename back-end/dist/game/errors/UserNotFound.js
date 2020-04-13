"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameError_1 = __importDefault(require("./GameError"));
const ErrorType_1 = __importDefault(require("./ErrorType"));
class UserNotFound extends GameError_1.default {
    constructor(userId) {
        super(ErrorType_1.default.USER_NOT_FOUND, "Could not found users");
        this.userId = userId;
    }
}
exports.default = UserNotFound;
//# sourceMappingURL=UserNotFound.js.map