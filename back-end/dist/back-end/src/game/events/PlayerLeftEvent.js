"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("./../contract/Events");
class PlayerLeftEvent extends Events_1.Event {
    constructor(userId, gameId) {
        super(Events_1.EventType.PLAYER_LEFT, {
            gameId,
            userId
        });
    }
}
exports.default = PlayerLeftEvent;
//# sourceMappingURL=PlayerLeftEvent.js.map