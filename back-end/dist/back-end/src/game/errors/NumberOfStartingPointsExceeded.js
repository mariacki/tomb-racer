"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorType_1 = __importDefault(require("./ErrorType"));
const GameError_1 = __importDefault(require("./GameError"));
class NumberOfStartingPointsExceeded extends GameError_1.default {
    constructor(maxNumberOfPlayers) {
        super(ErrorType_1.default.NUMBER_OF_STARTING_POINTS_EXCEEDED, "Number of starting points exceeded");
        this.maxNumberOfPlayers = maxNumberOfPlayers;
    }
}
exports.default = NumberOfStartingPointsExceeded;
//# sourceMappingURL=NumberOfStartingPointsExceeded.js.map