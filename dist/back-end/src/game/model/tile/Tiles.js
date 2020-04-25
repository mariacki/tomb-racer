"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tile_1 = require("./Tile");
const SpikedTile_1 = require("./SpikedTile");
const TilePosition_1 = require("./TilePosition");
const common_1 = require("../../../../../common");
exports.Tiles = {
    startingPoint() {
        return (row, col) => {
            return new Tile_1.Tile(common_1.TileType.STARTING_POINT, new TilePosition_1.TilePosition(row, col));
        };
    },
    path() {
        return (row, col) => {
            return new Tile_1.Tile(common_1.TileType.PATH, new TilePosition_1.TilePosition(row, col));
        };
    },
    wall() {
        return (row, col) => {
            return new Tile_1.Tile(common_1.TileType.WALL, new TilePosition_1.TilePosition(row, col));
        };
    },
    spikes() {
        return (row, col) => {
            return new SpikedTile_1.SipikedTile(new TilePosition_1.TilePosition(row, col));
        };
    },
    finishPoint() {
        return (row, col) => {
            return new Tile_1.Tile(common_1.TileType.FINISH_POINT, new TilePosition_1.TilePosition(row, col));
        };
    }
};
//# sourceMappingURL=Tiles.js.map