"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CUBE_START = 1;
const CUBE_END = 6;
class Turn {
    constructor(userId, rand) {
        this.actionPoints = 3;
        this.userId = userId;
        this.stepPoints = rand(CUBE_START, CUBE_END);
    }
    state() {
        return {
            userId: this.userId,
            stepPoints: this.stepPoints
        };
    }
}
exports.default = Turn;
//# sourceMappingURL=Turn.js.map