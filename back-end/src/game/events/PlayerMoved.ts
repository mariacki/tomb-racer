import { Event, EventType } from "../contract/Events"
import { Player } from "../model";
import { Position } from "../contract/dto";

export default class PlayerMoved extends Event
{
    constructor(
        gameId: string, 
        player: Player, 
        path: Position[]
    ) {
        super(EventType.PLAYER_MOVED, {
            gameId,
            userId: player.userId, 
            position: player.position,
            path
        })
    }
} 