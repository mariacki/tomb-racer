import { PlayerMoved, EventType } from "tr-common"
import { Player } from "../model";
import { Position } from "../contract";

export class PlayerMovedEvent implements PlayerMoved 
{
    isError: boolean = false;
    type: EventType = EventType.PLAYER_MOVED;
    origin: string;

    userId: string;
    pathUsed: Position[];

    constructor(
        gameId: string, 
        userId: string, 
        pathUsed: Position[]
    ) {
        this.origin = gameId;
        this.userId = userId;
        this.pathUsed = pathUsed; 
    }
} 