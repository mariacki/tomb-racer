"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const contract = __importStar(require("../contract"));
class PlayerJoinedEvent extends contract.events.Event {
    constructor(player, gameId) {
        super(contract.events.EventType.PLAYER_JOINED, {
            gameId,
            player: {
                userId: player.userId,
                userName: player.userName,
                hp: 100,
                position: player.position,
                inventory: []
            }
        });
    }
}
exports.default = PlayerJoinedEvent;
//# sourceMappingURL=PlayerJoinedEvent.js.map