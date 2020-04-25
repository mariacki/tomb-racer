"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const common_1 = require("../../../../common");
class IncorrectPlayerAction extends _1.GameError {
    constructor(gameId, playerExecutedAction, playerThatShouldExecuteAction) {
        super(common_1.ErrorType.INCORRECT_PLAYER_ACTION, undefined, "Inorrect Player Action");
        this.gameId = gameId;
        this.playerExecutedAction = playerExecutedAction;
        this.playerThatShouldExecuteAction = playerThatShouldExecuteAction;
    }
}
exports.IncorrectPlayerAction = IncorrectPlayerAction;
//# sourceMappingURL=IncorrectPlayerAction.js.map