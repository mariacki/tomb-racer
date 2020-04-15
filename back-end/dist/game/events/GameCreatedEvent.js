"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class GameCreatedEvent {
    constructor(game) {
        this.isError = false;
        this.type = tr_common_1.EventType.GAME_CREATED;
        this.origin = game.id;
        this.gameName = game.name;
        this.numberOfPlayers = game.players.length;
    }
}
exports.GameCreatedEvent = GameCreatedEvent;
//# sourceMappingURL=GameCreatedEvent.js.map