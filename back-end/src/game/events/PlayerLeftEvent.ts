import { Event, EventType } from './../contract/Events';

export default class PlayerLeftEvent extends Event
{
    constructor(userId: string, gameId: string) {
        super(EventType.PLAYER_LEFT, {
            gameId,
            userId
        });
    }
}