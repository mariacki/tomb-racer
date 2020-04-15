"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class TurnStartedEvent {
    constructor(gameId, turn) {
        this.type = tr_common_1.EventType.NEXT_TURN;
        this.origin = gameId;
        this.turn = turn;
    }
}
exports.TurnStartedEvent = TurnStartedEvent;
//# sourceMappingURL=TurnStartedEvent.js.map