import { Game } from "../../../../common";
import { RepositoryService } from "./RepositoryService";

export class GameStateService extends RepositoryService
{
    gameState(gameId: string): Game
    {
        return this.findGame(gameId).getState();
    }
}