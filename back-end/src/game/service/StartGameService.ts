import { GameRepository, PlayerData, EventDispatcher, randomize } from "../contract";
import { CannotStartGame } from "../errors";
import { RepositoryService } from "./RepositoryService";
import { Event } from '../../../../common';

export class StartGameService extends RepositoryService
{
    private event: EventDispatcher;
    private random: randomize;

    constructor(
        gameRepository: GameRepository, 
        eventDispatcher: EventDispatcher,
        random: randomize
    ) {
        super(gameRepository);
        this.event = eventDispatcher;
        this.random = random;
    }

    startRequest(request: PlayerData)
    {
        try {
            const game = this.findGame(request.gameId);
            
            game.addStartRequest(request.userId);

            if (!game.isReadyToStart()) {
                return;
            }
            
            const diceRoll = this.random(1, 6);
            const events = game.start(diceRoll);

            events.forEach((event) => this.event.dispatch(event));
            this.persistGame(game);
        } catch (gameError) {
            throw new CannotStartGame(gameError);
        }
    }
} 
