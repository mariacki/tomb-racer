"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
class GameCreatedEvent {
    constructor(game) {
        this.isError = false;
        this.type = common_1.EventType.GAME_CREATED;
        this.origin = undefined;
        this.gameId = game.id;
        this.gameName = game.name;
        this.numberOfPlayers = game.players.size();
    }
}
exports.GameCreatedEvent = GameCreatedEvent;
//# sourceMappingURL=GameCreatedEvent.js.map