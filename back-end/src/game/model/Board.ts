import { Position } from '../contract';
import { Tile } from './tile';
import { TileType, Tile as TileState, Board as BoardState } from 'tr-common';
import { InvalidBoard } from '../errors'
import { PathValidationResult } from './PathValidationResult';
import { TilePosition } from './tile/TilePosition';

class StartingPoint
{
    isFree: boolean = true;
    pos: TilePosition;

    constructor(pos: TilePosition) {
        this.pos = pos;
    }
}

export type BoardDefinition = (row: number, col: number) => Tile

export class Board implements BoardState
{
    tiles: Tile[][] = [];
    startingPoints: StartingPoint[] = [];

    constructor(definition: BoardDefinition[][]) {
        this.createTiles(definition);
        this.findStartingPoints();

        this.assertEnoughStartingPoints();
    }

    private assertEnoughStartingPoints() {
        if (this.startingPoints.length < 2) {
            throw new InvalidBoard();
        }
    }

    hasFreePositions() {
        const isFree = (startingPoint: StartingPoint) => startingPoint.isFree;
        const freeStartingPoints = this.startingPoints.filter(isFree);

        return freeStartingPoints.length > 0;
    }

    nextFreePosition(): TilePosition {
        const isFree = (startingPoint: StartingPoint) => startingPoint.isFree;
        const freeStartingPoints = this.startingPoints.filter(isFree);

        const startingPoint = freeStartingPoints.shift();
        startingPoint.isFree = false;
        
        return startingPoint.pos;
    }

    freeStartingPoint(pos: Position): void
    {
        this.startingPoints.filter((s) => {
            return s.pos.col == pos.col && 
                s.pos.row == pos.row
        })[0].isFree = true;
    }

    validatePath(path: TilePosition[], playerPosition: TilePosition, expectedLength: number): PathValidationResult {
        const invalidPositions = path.filter(this.invalidPosition());

        if (invalidPositions.length) {
            return new PathValidationResult(
                false,
                invalidPositions,
                "Paths goes through walls."
            );
        }

        if (path.length != expectedLength) {
            return new PathValidationResult(
                false,
                path,
                "Path has invalid length"
            )
        }

        const pathFirst = path[0];

        if (
            (pathFirst.row == playerPosition.row) && 
            (pathFirst.col == playerPosition.col)
        ) {
            return new PathValidationResult(
                false,
                [pathFirst],
                "Path starts at the player position"
            )
        }

        return this.validateAdjacency([playerPosition, ...path]);
    }

    private validateAdjacency(path: TilePosition[]): PathValidationResult {
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const current = path[i];

            if (!current.isAdjacentTo(prev)) {
                return new PathValidationResult(
                    false,
                    [prev, current],
                    "Path steps are not adjacent"
                )
            }
        }

        return new PathValidationResult(true, [], "Path OK");
    }

    getTilesOfPath(path: Position[]): Tile[] {
        return path.map((position: Position) => {
            return this.tiles[position.row][position.col];
        })
    }

    toTile() {
        return (position: Position) => this.tiles[position.row][position.col];
    }
    private invalidPosition() {
        return (position: Position) => {
            return !this.isValid(position);
        }
    }

    private isValid(position: Position): boolean {
        const tile: Tile = this.tiles[position.row][position.col];
        return tile.isWalkable();
    }

    private createTiles(definitions: BoardDefinition[][]) {
        this.tiles = definitions.map((rowDefs: BoardDefinition[], row) => {
            return [...rowDefs.map((def: BoardDefinition, col) => { return def(row, col)})]
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
        return this.tiles.map((row: Tile[]) => {
            return row.map((t: Tile) => {return {type: t.type}})
        });
    }
}