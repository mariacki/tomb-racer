export enum EventType {
    GAME_CREATED = "GAME-CREATED",
    PLAYER_JOINED = "PLAYER-JOINED",
    PLAYER_LEFT = "PLAYER-LEFT",
    GAME_STARTED = "GAME-STARTED",
    PLAYER_MOVED = "PLAYER-MOVED",
    PLAYER_HIT = "PLAYER-HIT",
    NEXT_TURN = "NEXT-TURN",
    PLAYER_DIED = "PLAYER-DIED",
    GAME_FINISHED = "GAME-FINISHED"
}

export class Event {
    type: EventType
    data: any

    constructor(type: EventType, data: any) {
        this.type = type;
        this.data = data;
    }
}

export interface EventDispatcher
{
    dispatch(event: Event): void;
}