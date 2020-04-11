import { Event, EventType } from './../contract/Events';

export default class PlayerLeftEvent extends Event
{
    constructor(userId: string) {
        super(EventType.PLAYER_LEFT, {
            userId
        });
    }
}