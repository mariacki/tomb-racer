import { GameRepository, EventDispatcher } from "../contract";
import { EventType, GameRemoved } from "tr-common";

export class RemoveGameService
{
    private repository: GameRepository;
    private eventDispatcher: EventDispatcher;

    constructor(repository: GameRepository, eventDispatcher: EventDispatcher)
    {
        this.repository = repository;
        this.eventDispatcher = eventDispatcher;
    }

    removeGame(gameId: string)
    {
        this.repository.remove(gameId);
        
        const event: GameRemoved = {
            isError: false,
            origin: undefined,
            type: EventType.GAME_REMOVED,
            gameId
        } 
        this.eventDispatcher.dispatch(event);
    }
}