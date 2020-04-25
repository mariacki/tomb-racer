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
        
        const events = [];
        
        events.push(...game.executeMovement(movement, this.context))
       
        if (game.canBeFinished())
        {
            events.push(...game.finish());
        } else {
            events.push(...game.startNextTurn(this.context.rnd(1, 6)));
        }

        events.forEach((event) => this.context.eventDispatcher.dispatch(event));
        super.persistGame(game);
    }
}