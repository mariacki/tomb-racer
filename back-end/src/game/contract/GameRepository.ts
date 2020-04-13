import { Game }  from '../model';

export interface GameRepository
{
    hasGameWithName(gameName: string): boolean;
    add(game: Game): void;
    findById(gameId: string): Game;
    persist(game: Game): void;
    findAll(): Game[];
}