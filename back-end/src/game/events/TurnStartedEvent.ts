import { TurnStarted, Turn, EventType } from "../../../../common";

export class TurnStartedEvent implements TurnStarted {
    
    isError: false;
    type: EventType = EventType.NEXT_TURN;
    origin: string;
    turn: Turn;

    constructor(gameId: string, turn: Turn) {
        this.origin = gameId;
        this.turn = turn;    
    }
}