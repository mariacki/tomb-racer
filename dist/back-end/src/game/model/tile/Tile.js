"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../../common");
class Tile {
    constructor(type, position) {
        this.type = type;
        this.position = position;
    }
    isWalkable() {
        return this.type != common_1.TileType.WALL;
    }
    onWalkThrough(player, game) { return []; }
    onPlaced(player, game) { return []; }
}
exports.Tile = Tile;
//# sourceMappingURL=Tile.js.map