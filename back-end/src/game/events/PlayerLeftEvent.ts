import { PlayerLeft, EventType } from 'tr-common';

export class PlayerLeftEvent implements PlayerLeft
{
    isError: boolean = false;
    type: EventType = EventType.PLAYER_LEFT;
    origin: string;
    
    userId: string;

    constructor(userId: string, gameId: string) {
        this.origin = gameId;
        this.userId = userId;   
    }
}