"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("../contract/Events");
class PlayerDied extends Events_1.Event {
    constructor(gameId, player) {
        super(Events_1.EventType.PLAYER_DIED, {
            gameId,
            userId: player.userId,
            movedTo: player.position
        });
    }
}
exports.default = PlayerDied;
//# sourceMappingURL=PlayerDied.js.map