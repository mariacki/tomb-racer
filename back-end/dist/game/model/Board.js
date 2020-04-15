"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tr_common_1 = require("tr-common");
const errors_1 = require("../errors");
const PathValidationResult_1 = require("./PathValidationResult");
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
    hasFreePositions() {
        const isFree = (startingPoint) => startingPoint.isFree;
        const freeStartingPoints = this.startingPoints.filter(isFree);
        return freeStartingPoints.length > 0;
    }
    nextFreePosition() {
        const isFree = (startingPoint) => startingPoint.isFree;
        const freeStartingPoints = this.startingPoints.filter(isFree);
        const startingPoint = freeStartingPoints.shift();
        startingPoint.isFree = false;
        return startingPoint.pos;
    }
    validatePath(path, playerPosition, expectedLength) {
        const invalidPositions = path.filter(this.invalidPosition());
        if (invalidPositions.length) {
            return new PathValidationResult_1.PathValidationResult(false, invalidPositions, "Paths goes through walls.");
        }
        if (path.length != expectedLength) {
            return new PathValidationResult_1.PathValidationResult(false, path, "Path has invalid length");
        }
        const pathFirst = path[0];
        if ((pathFirst.row == playerPosition.row) &&
            (pathFirst.col == playerPosition.col)) {
            return new PathValidationResult_1.PathValidationResult(false, [pathFirst], "Path starts at the player position");
        }
        return this.validateAdjacency([playerPosition, ...path]);
    }
    validateAdjacency(path) {
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const current = path[i];
            if (!current.isAdjacentTo(prev)) {
                return new PathValidationResult_1.PathValidationResult(false, [prev, current], "Path steps are not adjacent");
            }
        }
        return new PathValidationResult_1.PathValidationResult(true, [], "Path OK");
    }
    getTilesOfPath(path) {
        return path.map((position) => {
            return this.tiles[position.row][position.col];
        });
    }
    toTile() {
        return (position) => this.tiles[position.row][position.col];
    }
    invalidPosition() {
        return (position) => {
            return !this.isValid(position);
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
        return (tile) => tile.type === tr_common_1.TileType.STARTING_POINT;
    }
    toStartingPoint() {
        return (tile) => new StartingPoint(tile.position);
    }
    toTileList() {
        return this.tiles;
    }
}
exports.Board = Board;
//# sourceMappingURL=Board.js.map