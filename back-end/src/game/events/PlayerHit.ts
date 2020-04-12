import { Event, EventType } from "../contract/Events";

export default class PlayerHit extends Event {
    constructor(hpTaken: number, currentHp: number) {
        super(EventType.PLAYER_HIT, {
            hpTaken,
            currentHp
        })
    }
}