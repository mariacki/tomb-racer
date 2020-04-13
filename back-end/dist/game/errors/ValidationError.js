"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameError_1 = __importDefault(require("./GameError"));
class ValidationError extends GameError_1.default {
    constructor(type, field, message = "Validatoin Error") {
        super(type, message);
        this.type = type;
        this.field = field;
    }
}
exports.default = ValidationError;
//# sourceMappingURL=ValidationError.js.map