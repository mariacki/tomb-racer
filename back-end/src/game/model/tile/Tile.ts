import { TileType, Tile as ITile } from 'tr-common'
import { Player, Board, Game } from '../../model';
import { Context } from '../../contract';
import { TilePosition } from './TilePosition';

export class Tile implements ITile
{
    type: TileType
    position: TilePosition

    constructor(type: TileType, position: TilePosition)
    {
        this.type = type;
        this.position = position;
    }

    isWalkable(): boolean {
        return this.type == TileType.PATH ||
            this.type == TileType.STARTING_POINT ||
            this.type == TileType.FINISH_POINT;
    }

    onWalkThrough(player: Player, context: Context, game: Game) {}
    onPlaced(player: Player, board: Board, context: Context) {}
}