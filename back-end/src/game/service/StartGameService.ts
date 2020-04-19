import { GameRepository, PlayerData, Context } from "../contract";
import { CannotStartGame } from "../errors";
import { RepositoryService } from "./RepositoryService";

export class StartGameService extends RepositoryService
{
    private context: Context;

    constructor(gameRepository: GameRepository, context: Context)
    {
        super(gameRepository);
        this.context = context;
    }

    startRequest(request: PlayerData)
    {
        try {
            const game = this.findGame(request.gameId);
            game.startRequest(request.userId, this.context);
            this.persistGame(game);
        } catch (gameError) {
            throw new CannotStartGame(gameError);
        }
    }
} 
