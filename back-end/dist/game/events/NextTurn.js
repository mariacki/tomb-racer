"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("../contract/Events");
class NextTurn extends Events_1.Event {
    constructor(gameId, turn) {
        super(Events_1.EventType.NEXT_TURN, {
            gameId,
            turn
        });
    }
}
exports.default = NextTurn;
//# sourceMappingURL=NextTurn.js.map