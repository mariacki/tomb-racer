export enum TileType
{
    PATH,
    WALL,
    STARTING_POINT
}

export class Position
{
    row: number;
    col: number;

    constructor(row: number, col: number) 
    {
        this.row = row;
        this.col = col;
    }
}

export class Tile
{
    type: TileType
    position: Position

    constructor(type: TileType, position: Position)
    {
        this.type = type;
        this.position = position;
    }
}