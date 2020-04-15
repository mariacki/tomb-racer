"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
const events_1 = require("./../../events");
const Tile_1 = require("./Tile");
const HIT_VALUE = 20;
class SipikedTile extends Tile_1.Tile {
    constructor(position) {
        super(tr_common_1.TileType.SPIKES, position);
    }
    isWalkable() {
        return true;
    }
    onWalkThrough(player, context, game) {
        player.hp -= HIT_VALUE;
        context.eventDispatcher.dispatch(new events_1.PlayerHitEvent(game.id, player.userId, HIT_VALUE, player.hp));
    }
}
exports.SipikedTile = SipikedTile;
//# sourceMappingURL=SpikedTile.js.map