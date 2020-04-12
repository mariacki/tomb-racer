import { Event, EventType } from "../contract/Events";
import { Player } from "../model";

export default class GameFinished extends Event {
    constructor(gameId: string, winner: Player) {
        super(EventType.GAME_FINISHED, {
            gameId,
            winner: winner.userId
        })
    }
}