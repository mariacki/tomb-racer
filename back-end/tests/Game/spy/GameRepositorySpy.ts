import { GameInMemoryRepository } from '../../../src/repository/GameInMemoryRepository';
import { Game } from '../../../src/game/model/Game';

export class GameRepositorySpy extends GameInMemoryRepository
{
    addedGames: Array<Game> = [];
    persistedGames: Array<Game> = [];

    add(game: Game) {
        super.add(game);
        this.addedGames.push(game);
    }

    persist(game: Game) {
        super.persist(game);
        this.persistedGames.push(game);
    }
}