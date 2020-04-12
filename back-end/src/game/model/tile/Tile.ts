import Position from '../../contract/dto/Position';

export enum TileType
{
    PATH,
    WALL,
    STARTING_POINT
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

    isWalkable(): boolean {
        return this.type == TileType.PATH ||
            this.type == TileType.STARTING_POINT;
    }
}