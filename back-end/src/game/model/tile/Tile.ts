import Position from '../../contract/dto/Position';
import { Player, Game } from '..';
import Context from '../../contract/Context'
import { Board } from '../Board';
import PlayerHit from '../../events/PlayerHit';

export enum TileType
{
    PATH = "PATH",
    WALL = "WALL",
    STARTING_POINT = "STARTING_POINT",
    SPIKES = "SPIKES", 
    FINISH_POINT = "FINISH_POINT"
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
            this.type == TileType.STARTING_POINT ||
            this.type == TileType.FINISH_POINT;
    }

    onWalkThrough(player: Player, context: Context, game: Game) {}
    onPlaced(player: Player, board: Board, context: Context) {}
}

const HIT_VALUE = 20;

export class SipikedTile extends Tile
{
    constructor(position: Position) {
        super(TileType.SPIKES, position);
    }

    isWalkable() {
        return true;
    }

    onWalkThrough(player: Player, context: Context, game: Game) {
        player.hp -= HIT_VALUE;
        context.eventDispatcher.dispatch(new PlayerHit(
            game.id,
            player.userId,
            HIT_VALUE,
            player.hp
        ));
    }
}