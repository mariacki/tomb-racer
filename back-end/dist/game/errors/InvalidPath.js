"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const tr_common_1 = require("tr-common");
class InvalidPath extends _1.GameError {
    constructor(gameId, invalidPath, message) {
        super(tr_common_1.ErrorType.INVALID_PATH, gameId, message);
        this.invalidSteps = invalidPath;
    }
}
exports.InvalidPath = InvalidPath;
//# sourceMappingURL=InvalidPath.js.map