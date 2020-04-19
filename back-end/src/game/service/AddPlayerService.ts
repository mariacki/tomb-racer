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
        const player = new Player(
            request.userId,
            request.userName
        ); 

        game.addPlayer(player);

        super.persistGame(game);
        this.event.dispatch(new PlayerJoinedEvent(request.gameId, player));
    }
}