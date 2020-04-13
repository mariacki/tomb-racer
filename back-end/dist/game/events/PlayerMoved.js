"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("../contract/Events");
class PlayerMoved extends Events_1.Event {
    constructor(gameId, player, path) {
        super(Events_1.EventType.PLAYER_MOVED, {
            gameId,
            userId: player.userId,
            position: player.position,
            path
        });
    }
}
exports.default = PlayerMoved;
//# sourceMappingURL=PlayerMoved.js.map