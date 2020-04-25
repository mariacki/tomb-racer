"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
class PlayerFactory {
    static create(playerData, position) {
        return new Player_1.Player(playerData.userId, playerData.userName, position);
    }
}
exports.PlayerFactory = PlayerFactory;
//# sourceMappingURL=PlayerFactory.js.map