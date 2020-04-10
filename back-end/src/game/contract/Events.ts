export enum EventType {
    GAME_CREATED
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