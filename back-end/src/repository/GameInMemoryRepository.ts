import { GameRepository } from "../game/contract/GameRepository";
import { Game } from "../game/model";

export class GameInMemoryRepository implements GameRepository
{
    games: Array<Game> = [];

    hasGameWithName(gameName: string): boolean {
        const gamesWithName = this.games.filter(this.byName(gameName));

        return gamesWithName.length > 0;
    }

    findById(gameId: string): Game {
        return this.games.filter(this.byId(gameId))[0];
    }

    persist(game: Game): void {
        const index = this.games.findIndex(aGame => aGame.id === game.id); 

        if (index < 0) {
            this.games.push(game);
        }
    }

    findAll(): Game[] {
        return this.games;
    }

    private byName(name: string) {
        return (game: Game) => { return game.name == name };
    }

    private byId(gameId: string) {
        return (game: Game) => { 
            return game.id == gameId };
    }

    remove(gameId: string): void {
        this.games = this.games.filter((game: Game) => game.id != gameId);
    }
}