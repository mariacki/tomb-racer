import { Game } from '../model/Game';

export interface GameRepository
{
    hasGameWithName(gameName: string): boolean;
    add(game: Game): void;
    findById(gameId: string): Game;
    persist(game: Game): void;
}