import { GameInMemoryRepository } from '../../../src/repository/GameInMemoryRepository';
import { Game } from '../../../src/game/model';

export class GameRepositorySpy extends GameInMemoryRepository
{
    persistedGames: Array<Game> = [];
    addedGames: Array<Game> = [];
    lastPersistedGame: Game;

    persist(game: Game) {
        super.persist(game);
        this.persistedGames.push(game);
        this.addedGames.push(game);
        this.lastPersistedGame = game;
    }
}