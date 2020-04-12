import Position from '../contract/dto/Position';
import {Tile, TileType} from './tile/Tile'
import { boardDefinition } from '../contract'
import { NumberOfStartingPointsExceeded } from '../errors';
import InvalidBoard from '../errors/InvalidBoard';
import InvalidPath from '../errors/InvalidPath';

class StartingPoint
{
    isFree: boolean = true;
    pos: Position;

    constructor(pos: Position) {
        this.pos = pos;
    }
}

export class Board
{
    tiles: Tile[][] = [];
    startingPoints: StartingPoint[] = [];

    constructor(definition: boardDefinition[][]) {
        this.createTiles(definition);
        this.findStartingPoints();

        this.assertEnoughStartingPoints();
    }

    private assertEnoughStartingPoints() {
        if (this.startingPoints.length < 2) {
            throw new InvalidBoard();
        }
    }

    nextFreePosition(): Position {
        const isFree = (startingPoint: StartingPoint) => startingPoint.isFree;
        const freeStartingPoints = this.startingPoints.filter(isFree);

        if (freeStartingPoints.length == 0) {
            throw new NumberOfStartingPointsExceeded(this.startingPoints.length);
        }

        const startingPoint = freeStartingPoints.shift();
        startingPoint.isFree = false;
        
        return startingPoint.pos;
    }

    validatePath(path: Position[]) {
        for (const pos of path) {
            if (!this.isValid(pos)) {
                throw new InvalidPath();
            }
        }
    }

    private isValid(position: Position): boolean {
        const tile: Tile = this.tiles[position.row][position.col];
        return tile.isWalkable();
    }

    private createTiles(definitions: boardDefinition[][]) {
        this.tiles = definitions.map((rowDefs: boardDefinition[], row) => {
            return [...rowDefs.map((def: boardDefinition, col) => { return def(row, col)})]
        })
    }

    private findStartingPoints() {
        this.startingPoints = this.tiles.reduce((prev: StartingPoint[], curr: Tile[]) => {
            return prev.concat(this
                .findStartingPointsInRow(curr)
                .map(this.toStartingPoint())
            );
        }, [])
    }

    private findStartingPointsInRow(tiles: Tile[]): Tile[] {
        return tiles.filter(this.isStartingPoint());
    }

    private isStartingPoint() {
        return (tile: Tile) => tile.type === TileType.STARTING_POINT;
    }

    private toStartingPoint() {
        return (tile: Tile) => new StartingPoint(tile.position);
    }
}