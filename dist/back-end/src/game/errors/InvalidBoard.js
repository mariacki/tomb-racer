"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../../../common/events");
const _1 = require(".");
class InvalidBoard extends _1.GameError {
    constructor() {
        super(events_1.ErrorType.INVALID_BOARD, undefined, "Board does not have at least 2 stargin points");
        this.minNumberOfStartingPoints = 2;
    }
}
exports.InvalidBoard = InvalidBoard;
//# sourceMappingURL=InvalidBoard.js.map