"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameError extends Error {
    constructor(type, message) {
        super(message);
        this.type = type;
    }
}
exports.default = GameError;
//# sourceMappingURL=GameError.js.map