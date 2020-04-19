import { GameRepository } from "../contract";
import { GameNotFound } from "../errors";
import { Game } from "../model";

export abstract class RepositoryService
{   
    protected gameRepository: GameRepository

    constructor(gameRepository: GameRepository)
    {
        this.gameRepository = gameRepository;
    }

    protected findGame(gameId: string)
    {
        const game = this.gameRepository.findById(gameId);

        if (!game) {
            throw new GameNotFound(gameId);
        }

        return game;
    }

    protected persistGame(game: Game)
    {
        this.gameRepository.persist(game);
    }
}