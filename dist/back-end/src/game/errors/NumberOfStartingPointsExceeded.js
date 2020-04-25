"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const _1 = require(".");
class NumberOfStartingPointsExceeded extends _1.GameError {
    constructor(maxNumberOfPlayers, gameId) {
        super(common_1.ErrorType.NUMBER_OF_STARTING_POINTS_EXCEEDED, gameId, "Number of starting points exceeded");
        this.maxNumberOfPlayers = maxNumberOfPlayers;
    }
}
exports.NumberOfStartingPointsExceeded = NumberOfStartingPointsExceeded;
//# sourceMappingURL=NumberOfStartingPointsExceeded.js.map