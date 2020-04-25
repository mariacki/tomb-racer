import { GameFinished, EventType } from '../../../../common';

export class GameFinishedEvent implements GameFinished {
    
    isError: boolean;
    type: EventType;
    origin: string;
    userId: string;

    constructor(gameId: string, userId: string) {
        this.isError = false;
        this.type = EventType.GAME_FINISHED;
        this.origin = gameId;
        this.userId = userId;
    }
}