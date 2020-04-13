import Position from '../contract/dto/Position';
import {Tile, TileType} from './tile/Tile'
import { boardDefinition } from '../contract'
import { NumberOfStartingPointsExceeded } from '../errors';
import InvalidBoard from '../errors/InvalidBoard';
import InvalidPath from '../errors/InvalidPath';
import { TileState } from '../contract/dto/GameState';

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

    validatePath(path: Position[], playerPosition: Position, expectedLength: number) {
        const validPositions = path.filter(this.validPositions());

        if (validPositions.length != path.length) {
            throw new InvalidPath("Path contains invalid positions");
        }

        if (validPositions.length != expectedLength) {
            throw new InvalidPath(`Path should have ${expectedLength} positons, given had: ${validPositions.length} positions`)
        }

        const pathFirst = path[0];

        if (
            (pathFirst.row == playerPosition.row) && 
            (pathFirst.col == playerPosition.col)
        ) {
            throw new InvalidPath("Path cannot start at player position");
        }

        this.validateAdjacency([playerPosition, ...path]);
    }

    private throwAdjacencyError(current: Position, prev: Position) {
        throw new InvalidPath(`Path element: ${current.toString()} is not adjacent to ${prev.toString()}`)
    }

    private validateAdjacency(path: Position[]) {
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const current = path[i];

            if (!current.isAdjacentTo(prev)) {
                this.throwAdjacencyError(current, prev);
            }
        }
    }

    getTilesOfPath(path: Position[]): Tile[] {
        return path.map((position: Position) => {
            console.log('In the loop of positions')
            return this.tiles[position.row][position.col];
        })
    }

    toTile() {
        return (position: Position) => this.tiles[position.row][position.col];
    }
    private validPositions() {
        return (position: Position) => {
            return this.isValid(position);
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

    toTileList(): TileState[][] {
        return this.tiles.map((tilesRow) => {
            return tilesRow.map((tile) => { return {type: tile.type.toString()}})
        })
    }
}