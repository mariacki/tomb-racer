"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
class Tile {
    constructor(type, position) {
        this.type = type;
        this.position = position;
    }
    isWalkable() {
        return this.type == tr_common_1.TileType.PATH ||
            this.type == tr_common_1.TileType.STARTING_POINT ||
            this.type == tr_common_1.TileType.FINISH_POINT;
    }
    onWalkThrough(player, context, game) { }
    onPlaced(player, board, context) { }
}
exports.Tile = Tile;
//# sourceMappingURL=Tile.js.map