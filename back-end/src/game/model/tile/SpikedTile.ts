import { TileType } from 'tr-common';
import { PlayerHitEvent } from './../../events';
import { Context } from '../../contract';
import { Player, Game } from '../../model';
import { Tile } from './Tile';
import { TilePosition } from './TilePosition';

const HIT_VALUE = 20;

export class SipikedTile extends Tile
{
    constructor(position: TilePosition) {
        super(TileType.SPIKES, position);
    }

    isWalkable() {
        return true;
    }

    onWalkThrough(player: Player, context: Context, game: Game) {
        player.hp -= HIT_VALUE;
        context.eventDispatcher.dispatch(new PlayerHitEvent(
            game.id,
            player.userId,
            HIT_VALUE,
            player.hp
        ));
    }
}