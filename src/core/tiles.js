/**
 * Player position on the board
 */
class Position {

    /**
     * 
     * @param {Number} row 
     * @param {Number} col 
     */
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    equals(position) {
        return this.row === position.row && 
            this.col === position.col;
    }

    toKey() {
        return `${this.row}_${this.col}`;
    }
}

class Tile
{
    constructor(position) {
        this.position = position;
    }

    /**
     * @returns {String}
     */
    getType() {
        throw "Not implemented by subclass";
    }

    isWalkable() {
        return false;
    }
}

/**
 * Tail that players are placed at the beginning to the game.
 */
class StartingPointTail extends Tile {
    constructor(position) {
        super(position);
        this.type = TileType.STARTING_POINT;
    }

    getType() {
        return this.type;
    }

    isWalkable() {
        return true;
    }
}

class WalkableTile extends Tile {

    constructor(position) {
        super(position);
        this.type = TileType.WALKABLE;
    }

    getType() {
        return this.type;
    }

    isWalkable() {
        return true;
    }
}

class WallTile extends Tile {
    constructor(position) {
        super(position)
        this.type = TileType.WALL;
    }

    getType() {
        return this.type;
    }

    isWalkable() {
        return false;
    }
}

/**
 * Factory for game tails.
 */
const Tiles = {
    startingPoint() {
        return (row, col) => {
            return new StartingPointTail(new Position(row, col));
        }
    },

    walkable () {
        return (row, col) => {
            return new WalkableTile(new Position(row, col));
        }
    },

    wall () {
        return (row, col) => {
            return new WallTile(new Position(row, col));
        }
    }

}

const TileType = {
    WALKABLE: "WALKABLE",
    STARTING_POINT: "STARTING_POINT",
    WALL: "WALL"
}

module.exports = {Tiles, Position, TileType}