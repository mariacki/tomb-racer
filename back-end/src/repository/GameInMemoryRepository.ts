import { GameRepository } from "../game/contract/GameRepository";
import { Game } from "../game/model/Game";

export class GameInMemoryRepository implements GameRepository
{
    games: Array<Game> = [];

    hasGameWithName(gameName: string): boolean {
        const gamesWithName = this.games.filter(this.byName(gameName));

        return gamesWithName.length > 0;
    }

    add(game: Game): void {
        this.games.push(game);
    }

    findById(gameId: string): Game {
        return this.games.filter(this.byId(gameId))[0];
    }

    persist(game: Game): void {
        
    }

    private byName(name: string) {
        return (game: Game) => { return game.name == name };
    }

    private byId(gameId: string) {
        return (game: Game) => { 
            console.log(`${game.id} == ${gameId}`);
            return game.id == gameId };
    }
}