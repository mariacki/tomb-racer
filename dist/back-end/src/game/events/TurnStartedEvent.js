"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
class TurnStartedEvent {
    constructor(gameId, turn) {
        this.type = common_1.EventType.NEXT_TURN;
        this.origin = gameId;
        this.turn = turn;
    }
}
exports.TurnStartedEvent = TurnStartedEvent;
//# sourceMappingURL=TurnStartedEvent.js.map