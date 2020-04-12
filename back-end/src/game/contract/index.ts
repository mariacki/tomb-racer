import { GameRepository } from './GameRepository';
import { GameService, boardDefinition } from './GameService';
import { IdProvider } from './IdProvider';
import * as events from './Events';
import * as DTO from './dto';

type randomize = (start: number, end: number) => number;

export {
    GameRepository,
    GameService,
    IdProvider,
    DTO,
    events,
    boardDefinition,
    randomize,
}