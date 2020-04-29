import { GameRepository, EventDispatcher, PlayerData, randomize } from "../contract";
import { GameNotFound } from "../errors";
import { PlayerLeftEvent } from "../events";
import { RepositoryService } from "./RepositoryService";
import { Event } from './../../../../common';

export class RemovePlayerService extends RepositoryService
{
    private event: EventDispatcher
    private rnd: randomize;

    constructor(
        gameRepository: GameRepository,
        event: EventDispatcher,
        rnd: randomize
    ) {
        super(gameRepository);
        this.event = event
        this.rnd = rnd;
    }

    removePlayer(request: PlayerData)
    {
        const game = this.findGame(request.gameId);
        const events: Event[] = [];

        events.push(...game.removePlayer(request.userId));

        if (
            game.hasPlayers() &&
            game.isCurrentlyPlaying(request.userId)
        ) {
            const diceRoll = this.rnd(1, 6);
            events.push(...game.startNextTurn(diceRoll))
        }
        
        this.gameRepository.persist(game);
        events.forEach(event => this.event.dispatch(event));
    }
}