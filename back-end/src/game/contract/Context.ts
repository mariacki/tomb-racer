import { EventDispatcher } from './Events';
import { IdProvider, GameRepository, randomize } from './.';

export default class Context
{
    eventDispatcher: EventDispatcher;
    idProvider: IdProvider;
    rnd: randomize;
    repository: GameRepository

    constructor(
        eventDispatcher: EventDispatcher,
        idProvider: IdProvider,
        repository : GameRepository,
        rnd: randomize
    ) {
        this.eventDispatcher = eventDispatcher;
        this.idProvider = idProvider;
        this.rnd = rnd;
        this.repository = repository;
    }
}
