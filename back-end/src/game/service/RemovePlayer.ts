import { GameRepository, EventDispatcher, PlayerData } from "../contract";
import { GameNotFound } from "../errors";
import { PlayerLeftEvent } from "../events";
import { RepositoryService } from "./RepositoryService";

export class RemovePlayerService extends RepositoryService
{
    private event: EventDispatcher

    constructor(
        gameRepository: GameRepository,
        event: EventDispatcher
    ) {
        super(gameRepository);
        this.event = event
    }

    removePlayer(request: PlayerData)
    {
        const game = this.findGame(request.gameId);
        
        game.removePlayer(request.userId);

        this.gameRepository.persist(game);
        this.event.dispatch(
            new PlayerLeftEvent(request.userId, request.gameId)
        );
    }
}