import { Movement, GameRepository, Context } from "../contract";
import { RepositoryService } from "./RepositoryService";

export class MovementService extends RepositoryService
{
    private context: Context

    constructor(
        gameRepository: GameRepository, 
        context: Context
    ) {
        super(gameRepository);
        this.context = context;
    }

    executeMovement(movement: Movement)
    {
        const game = super.findGame(movement.gameId);
        game.movment(movement, this.context)
        super.persistGame(game);
    }
}