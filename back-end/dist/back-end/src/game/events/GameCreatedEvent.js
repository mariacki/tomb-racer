"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const contract = __importStar(require("./../contract"));
class GameCreatedEvent extends contract.events.Event {
    constructor(game) {
        super(contract.events.EventType.GAME_CREATED, {
            gameId: game.id,
            gameName: game.name,
            numberOfPlayers: game.players.length
        });
    }
}
exports.default = GameCreatedEvent;
//# sourceMappingURL=GameCreatedEvent.js.map