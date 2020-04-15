"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameError extends Error {
    constructor(type, origin = undefined, message = "") {
        super(message);
        this.type = type;
        this.isError = true;
        this.origin = origin;
    }
}
exports.GameError = GameError;
//# sourceMappingURL=GameError.js.map