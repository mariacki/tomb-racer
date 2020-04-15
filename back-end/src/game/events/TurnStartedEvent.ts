import { TurnStarted, Turn, EventType } from "tr-common";

export class TurnStartedEvent implements TurnStarted {
    
    isError: false;
    type: EventType = EventType.NEXT_TURN;
    origin: string;
    turn: Turn;

    constructor(gameId: string, turn: Turn) {
        console.log("In event", turn);
        this.origin = gameId;
        this.turn = turn;    
    }
}