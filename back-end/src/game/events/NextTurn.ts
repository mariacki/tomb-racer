import { Event, EventType } from "../contract/Events";
import Turn from "../model/Turn";

export default class NextTurn extends Event {
    constructor(gameId: string, turn: Turn) {
        super(EventType.NEXT_TURN, {
            gameId,
            turn
        })
    }
}