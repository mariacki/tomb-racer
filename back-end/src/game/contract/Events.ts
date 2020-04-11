export enum EventType {
    GAME_CREATED,
    PLAYER_JOINED,
    PLAYER_LEFT
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