export enum EventType {
    GAME_CREATED,
    PLAYER_JOINED,
    PLAYER_LEFT,
    GAME_STARTED,
    PLAYER_MOVED,
    PLAYER_HIT,
    NEXT_TURN,
    PLAYER_DIED,
    GAME_FINISHED
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