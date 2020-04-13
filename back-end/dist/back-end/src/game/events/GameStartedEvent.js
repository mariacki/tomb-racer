"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("./../contract/Events");
class GameStartedEvent extends Events_1.Event {
    constructor(gameId, turn) {
        super(Events_1.EventType.GAME_STARTED, {
            gameId,
            turn
        });
    }
}
exports.default = GameStartedEvent;
//# sourceMappingURL=GameStartedEvent.js.map