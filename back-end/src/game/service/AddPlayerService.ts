import { PlayerData, GameRepository, EventDispatcher } from "../contract";
import { GameNotFound } from "../errors";
import { Player, Game } from "../model";
import { PlayerJoinedEvent } from "../events";
import { RepositoryService } from "./RepositoryService";

export class AddPlayerService extends RepositoryService
{
    private event: EventDispatcher;

    constructor(
        gameRepository: GameRepository,
        event: EventDispatcher
    ) {
        super(gameRepository)
        this.event = event;
    }

    addPlayer(request: PlayerData)
    {
        const game = super.findGame(request.gameId);
        const events = game.addPlayer(request);

        this.gameRepository.persist(game);
        events.forEach((event) => this.event.dispatch(event));
    }
}