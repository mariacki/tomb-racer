"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tile_1 = require("./tile");
const errors_1 = require("../errors");
class Path {
    constructor(positions, board, expectedLengh) {
        this.board = board;
        this.assertLength(positions.length, expectedLengh);
        this.setPositions(positions);
    }
    executeWalk(player, game) {
        if (!player.position.isAdjacentTo(this.first())) {
            throw new errors_1.InvalidPath([this.first()], "Some message");
        }
        const events = [];
        this.positions.forEach((pos) => {
            const tile = this.board.getTile(pos);
            events.push(...tile.onWalkThrough(player, game));
        });
        player.position = this.positions[this.positions.length - 1];
        events.push(...this.board.getTile(player.position).onPlaced(player, game));
        return events;
    }
    first() {
        return this.positions[0];
    }
    assertLength(positionsLength, expectedLengh) {
        if (positionsLength !== expectedLengh) {
            throw new errors_1.InvalidPath([], "Path has invalid length");
        }
    }
    setPositions(positions) {
        const tilePositions = this.toTilePositions(positions);
        this.assertValid(tilePositions);
        this.positions = tilePositions;
    }
    toTilePositions(positions) {
        return positions
            .map((pos) => tile_1.TilePosition.fromDto(pos));
    }
    assertValid(positions) {
        this.assertWalkable(positions);
        this.assertAdjacent(positions);
    }
    assertWalkable(positions) {
        const notWalkable = positions
            .filter((pos) => !this.board.isValid(pos));
        if (notWalkable.length) {
            throw new errors_1.InvalidPath(notWalkable, "Path goes through walls");
        }
    }
    assertAdjacent(pasitions) {
        for (let i = 1; i < pasitions.length; i++) {
            const prev = pasitions[i - 1];
            const current = pasitions[i];
            if (!current.isAdjacentTo(prev)) {
                throw new errors_1.InvalidPath([prev, current], "Path steps are not adjacent");
            }
        }
    }
}
exports.Path = Path;
//# sourceMappingURL=Path.js.map