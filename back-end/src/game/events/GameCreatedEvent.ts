import { Game } from '../model';
import { EventType, GameCreated } from 'tr-common';

export class GameCreatedEvent implements GameCreated 
{
    isError: boolean;
    type: EventType
    origin: string;
    gameName: string;
    numberOfPlayers: number;

    constructor(game: Game) {
        this.isError = false;
        this.type = EventType.GAME_CREATED;
        this.origin = game.id;
        this.gameName = game.name;
        this.numberOfPlayers = game.players.length;
    }
}