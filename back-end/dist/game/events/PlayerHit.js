"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("../contract/Events");
class PlayerHit extends Events_1.Event {
    constructor(gameId, userId, hpTaken, currentHp) {
        super(Events_1.EventType.PLAYER_HIT, {
            gameId,
            userId,
            hpTaken,
            currentHp
        });
    }
}
exports.default = PlayerHit;
//# sourceMappingURL=PlayerHit.js.map