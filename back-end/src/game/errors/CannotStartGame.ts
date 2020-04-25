import { ErrorType, ErrorEvent,  CannotStartGame as ICannotStartGame } from '../../../../common';
import { GameError } from './GameError';
 
export class CannotStartGame extends GameError implements ICannotStartGame 
{
    reason: ErrorEvent;

    constructor(reason: ErrorEvent) {
        super(ErrorType.CANNOT_START_GAME, undefined, "Cannot start game")
        this.reason = reason;
    }
}