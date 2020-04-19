import { GameInfo } from "tr-common";
import { RepositoryService } from "./RepositoryService";

export class GamesListService extends RepositoryService
{
    gameList(): GameInfo[]
    {
        return this.gameRepository.findAll().map(game => {
            return {
                id: game.id,
                name: game.name
            }
        })
    }
}