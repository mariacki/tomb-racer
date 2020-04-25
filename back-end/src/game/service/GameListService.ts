import { RepositoryService } from "./RepositoryService";
import { GameInfo } from "../../../../common";
import { GameRepository } from "../contract";

export class GameListService extends RepositoryService
{
    constructor(gameRepository: GameRepository)
    {
        super(gameRepository);
    }

    gameList(): GameInfo[] {
        return this.gameRepository.findAll().map(game => {
            return {
                id: game.id,
                name: game.name
            }
        })
    }
}