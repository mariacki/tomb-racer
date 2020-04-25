"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CUBE_START = 1;
const CUBE_END = 6;
class GameTurn {
    constructor(userId, diceRoll) {
        this.currentlyPlaying = userId;
        this.stepPoints = diceRoll;
    }
}
exports.GameTurn = GameTurn;
//# sourceMappingURL=GameTurn.js.map