"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tile_1 = require("./tile/Tile");
const errors_1 = require("../errors");
const InvalidBoard_1 = __importDefault(require("../errors/InvalidBoard"));
const InvalidPath_1 = __importDefault(require("../errors/InvalidPath"));
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
            throw new InvalidBoard_1.default();
        }
    }
    nextFreePosition() {
        const isFree = (startingPoint) => startingPoint.isFree;
        const freeStartingPoints = this.startingPoints.filter(isFree);
        if (freeStartingPoints.length == 0) {
            throw new errors_1.NumberOfStartingPointsExceeded(this.startingPoints.length);
        }
        const startingPoint = freeStartingPoints.shift();
        startingPoint.isFree = false;
        return startingPoint.pos;
    }
    validatePath(path, playerPosition, expectedLength) {
        const validPositions = path.filter(this.validPositions());
        if (validPositions.length != path.length) {
            throw new InvalidPath_1.default("Path contains invalid positions");
        }
        if (validPositions.length != expectedLength) {
            throw new InvalidPath_1.default(`Path should have ${expectedLength} positons, given had: ${validPositions.length} positions`);
        }
        const pathFirst = path[0];
        if ((pathFirst.row == playerPosition.row) &&
            (pathFirst.col == playerPosition.col)) {
            throw new InvalidPath_1.default("Path cannot start at player position");
        }
        this.validateAdjacency([playerPosition, ...path]);
    }
    throwAdjacencyError(current, prev) {
        throw new InvalidPath_1.default(`Path element: ${current.toString()} is not adjacent to ${prev.toString()}`);
    }
    validateAdjacency(path) {
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const current = path[i];
            if (!current.isAdjacentTo(prev)) {
                this.throwAdjacencyError(current, prev);
            }
        }
    }
    getTilesOfPath(path) {
        return path.map(this.toTile());
    }
    toTile() {
        return (position) => this.tiles[position.row][position.col];
    }
    validPositions() {
        return (position) => {
            return this.isValid(position);
        };
    }
    isValid(position) {
        const tile = this.tiles[position.row][position.col];
        return tile.isWalkable();
    }
    createTiles(definitions) {
        this.tiles = definitions.map((rowDefs, row) => {
            return [...rowDefs.map((def, col) => { return def(row, col); })];
        });
    }
    findStartingPoints() {
        this.startingPoints = this.tiles.reduce((prev, curr) => {
            return prev.concat(this
                .findStartingPointsInRow(curr)
                .map(this.toStartingPoint()));
        }, []);
    }
    findStartingPointsInRow(tiles) {
        return tiles.filter(this.isStartingPoint());
    }
    isStartingPoint() {
        return (tile) => tile.type === Tile_1.TileType.STARTING_POINT;
    }
    toStartingPoint() {
        return (tile) => new StartingPoint(tile.position);
    }
    toTileList() {
        return this.tiles.map((tilesRow) => {
            return tilesRow.map((tile) => { return { type: tile.type.toString() }; });
        });
    }
}
exports.Board = Board;
//# sourceMappingURL=Board.js.map