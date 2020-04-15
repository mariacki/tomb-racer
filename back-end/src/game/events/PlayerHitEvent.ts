import { PlayerHit, EventType } from "tr-common";

export class PlayerHitEvent implements PlayerHit
{
    isError: boolean = false;
    type: EventType = EventType.PLAYER_HIT;
    origin: string;

    userId: string;
    hpTaken: number;
    currentHp: number;

    constructor(
        gameId: string, 
        userId: string, 
        hpTaken: number, 
        currentHp: number
    ) {
        this.origin = gameId;
        this.userId = userId;
        this.hpTaken = hpTaken;
        this.currentHp = currentHp;
    }
}