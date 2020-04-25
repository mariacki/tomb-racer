import { Position } from '../contract';
import { Tile } from './tile';
import { TileType, Tile as TileState, Board as BoardState } from '../../../../common';
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

    constructor(definition: BoardDefinition[][])
    {
        this.createTiles(definition);
        this.findStartingPoints();

        this.assertEnoughStartingPoints();
    }

    private assertEnoughStartingPoints()
    {
        if (this.startingPoints.length < 2) {
            throw new InvalidBoard();
        }
    }

    hasFreeStartingPoints(): boolean
    {
        return this.getFreStartingPoints().length > 0;
    }

    numberOfStartingPoints(): number
    {
        return this.startingPoints.length;
    }

    reserveStartingPoint(): TilePosition
    {
        const startingPoint = this
            .getFreStartingPoints()
            .shift();

        startingPoint.isFree = false;
        return startingPoint.pos;
    }

    getTile(pos: Position): Tile
    {
        return this.tiles[pos.row][pos.col];
    }

    freeStartingPoint(pos: Position): void
    {
        this.startingPoints.filter((s) => {
            return s.pos.col == pos.col && 
                s.pos.row == pos.row
        })[0].isFree = true;
    }

    isValid(position: Position): boolean {
        const tile: Tile = this.tiles[position.row][position.col];
        console.log("Tile Type", tile.type, tile.position);
        return tile.type != TileType.WALL;
    }

    private createTiles(definitions: BoardDefinition[][]) {
        this.tiles = definitions.map((rowDefs: BoardDefinition[], row) => {
            return [...rowDefs.map((def: BoardDefinition, col) => { return def(row, col)})]
        })
    }

    private findStartingPoints() {
        this.startingPoints = this
            .tiles
            .reduce(
                (prev: StartingPoint[], curr: Tile[]) => {
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

    private getFreStartingPoints(): StartingPoint[]
    {
        const isFree = (startingPoint: StartingPoint) => startingPoint.isFree;
        return this.startingPoints.filter(isFree);
    }
}