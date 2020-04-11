import * as contract from './../contract'
import { Game } from '../model';

export default class GameCreatedEvent extends contract.events.Event
{
    constructor(game: Game) {
        super(
            contract.events.EventType.GAME_CREATED,
            {
                gameId: game.id,
                gameName: game.name,
                numberOfPlayers: game.players.length
            }
        )
    }
}