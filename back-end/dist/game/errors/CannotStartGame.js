"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
const _1 = require(".");
class CannotStartGame extends _1.GameError {
    constructor(reason) {
        super(tr_common_1.ErrorType.CANNOT_START_GAME, undefined, "Cannot start game");
        this.reason = reason;
    }
}
exports.default = CannotStartGame;
//# sourceMappingURL=CannotStartGame.js.map