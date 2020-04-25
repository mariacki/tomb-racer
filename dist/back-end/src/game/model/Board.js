"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
const errors_1 = require("../errors");
class StartingPoint {
    constructor(pos) {
        this.isFree = true;
        this.pos = pos;
    }
}
class Board {
    constructor(definition) {
        this.tiles = [];
        this.startingPoints = [];
        this.createTiles(definition);
        this.findStartingPoints();
        this.assertEnoughStartingPoints();
    }
    assertEnoughStartingPoints() {
        if (this.startingPoints.length < 2) {
            throw new errors_1.InvalidBoard();
        }
    }
    hasFreeStartingPoints() {
        return this.getFreStartingPoints().length > 0;
    }
    numberOfStartingPoints() {
        return this.startingPoints.length;
    }
    reserveStartingPoint() {
        const startingPoint = this
            .getFreStartingPoints()
            .shift();
        startingPoint.isFree = false;
        return startingPoint.pos;
    }
    getTile(pos) {
        return this.tiles[pos.row][pos.col];
    }
    freeStartingPoint(pos) {
        this.startingPoints.filter((s) => {
            return s.pos.col == pos.col &&
                s.pos.row == pos.row;
        })[0].isFree = true;
    }
    isValid(position) {
        const tile = this.tiles[position.row][position.col];
        console.log("Tile Type", tile.type, tile.position);
        return tile.type != common_1.TileType.WALL;
    }
    createTiles(definitions) {
        this.tiles = definitions.map((rowDefs, row) => {
            return [...rowDefs.map((def, col) => { return def(row, col); })];
        });
    }
    findStartingPoints() {
        this.startingPoints = this
            .tiles
            .reduce((prev, curr) => {
            return prev.concat(this
                .findStartingPointsInRow(curr)
                .map(this.toStartingPoint()));
        }, []);
    }
    findStartingPointsInRow(tiles) {
        return tiles.filter(this.isStartingPoint());
    }
    isStartingPoint() {
        return (tile) => tile.type === common_1.TileType.STARTING_POINT;
    }
    toStartingPoint() {
        return (tile) => new StartingPoint(tile.position);
    }
    toTileList() {
        return this.tiles.map((row) => {
            return row.map((t) => { return { type: t.type }; });
        });
    }
    getFreStartingPoints() {
        const isFree = (startingPoint) => startingPoint.isFree;
        return this.startingPoints.filter(isFree);
    }
}
exports.Board = Board;
//# sourceMappingURL=Board.js.map