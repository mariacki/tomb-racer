"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const common_1 = require("../../../../common");
class InvalidPath extends _1.GameError {
    constructor(invalidPath, message) {
        super(common_1.ErrorType.INVALID_PATH, undefined, message);
        this.invalidSteps = invalidPath;
    }
}
exports.InvalidPath = InvalidPath;
//# sourceMappingURL=InvalidPath.js.map