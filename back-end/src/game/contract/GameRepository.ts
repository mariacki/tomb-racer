import { Game }  from '../model';

export interface GameRepository
{
    hasGameWithName(gameName: string): boolean;
    findById(gameId: string): Game;
    persist(game: Game): void;
    findAll(): Game[];
}