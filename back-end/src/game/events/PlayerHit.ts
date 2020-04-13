import { Event, EventType } from "../contract/Events";

export default class PlayerHit extends Event {
    constructor(gameId: string, userId: string, hpTaken: number, currentHp: number) {
        super(EventType.PLAYER_HIT, {
            gameId,
            userId,
            hpTaken,
            currentHp
        })
    }
}