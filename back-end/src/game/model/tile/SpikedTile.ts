import { TileType, Event } from 'tr-common';
import { Player, Game } from '../../model';
import { Tile } from './Tile';
import { TilePosition } from './TilePosition';
import { PlayerHitEvent } from '../../events';

const HIT_VALUE = 20;

export class SipikedTile extends Tile
{
    constructor(position: TilePosition) {
        super(TileType.SPIKES, position);
    }

    isWalkable() {
        return true;
    }

    onWalkThrough(player: Player, game: Game): Event[]
    {
        player.takeHit(HIT_VALUE);

        return [new PlayerHitEvent(
            game.id, 
            player.userId, 
            HIT_VALUE,
            player.hp
        )];
    }
}