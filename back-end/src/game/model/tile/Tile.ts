import { TileType, Tile as ITile, Event } from '../../../../../common'
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
        return this.type != TileType.WALL;
    }

    onWalkThrough(player: Player, game: Game): Event[] { return [] }
    onPlaced(player: Player, game: Game): Event[] { return [] }
}