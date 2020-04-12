import { Event, EventType } from "../contract/Events";
import { Player } from "../model";

export default class PlayerDied extends Event
{
    constructor(gameId: string, player: Player) {
        super(EventType.PLAYER_DIED, {
            gameId,
            userId: player.userId,
            movedTo: player.position
        })
    }
}