"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../../common");
const Tile_1 = require("./Tile");
const events_1 = require("../../events");
const HIT_VALUE = 20;
class SipikedTile extends Tile_1.Tile {
    constructor(position) {
        super(common_1.TileType.SPIKES, position);
    }
    isWalkable() {
        return true;
    }
    onWalkThrough(player, game) {
        player.takeHit(HIT_VALUE);
        return [new events_1.PlayerHitEvent(game.id, player.userId, HIT_VALUE, player.hp)];
    }
}
exports.SipikedTile = SipikedTile;
//# sourceMappingURL=SpikedTile.js.map