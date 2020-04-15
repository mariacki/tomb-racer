import { PlayerJoined, EventType, Player } from 'tr-common';

export class PlayerJoinedEvent implements PlayerJoined
{
    isError: boolean = false;
    type: EventType = EventType.PLAYER_JOINED;
    origin: string;

    player: Player;

    constructor (gameId: string, player: Player) {
        this.origin = gameId;
        this.player = player;
    }   
}