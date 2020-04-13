"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("../contract/Events");
class GameFinished extends Events_1.Event {
    constructor(gameId, winner) {
        super(Events_1.EventType.GAME_FINISHED, {
            gameId,
            winner: winner.userId
        });
    }
}
exports.default = GameFinished;
//# sourceMappingURL=GameFinished.js.map