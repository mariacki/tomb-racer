import { Event, EventType } from './../contract/Events';
import Turn from '../model/Turn';

export default class GameStartedEvent extends Event
{
    constructor(gameId: string, turn: Turn) {
        super(EventType.GAME_STARTED, {
            gameId,
            turn
        });
    }
}