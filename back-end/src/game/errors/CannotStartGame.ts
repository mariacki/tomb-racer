import { 
    ErrorType,
    CannotStartGame as ICannotStartGame
} from 'tr-common/events';
import GameError from './GameError';

export default class CannotStartGame extends GameError implements ICannotStartGame 
{
    reason: GameError;

    constructor(reason: GameError) {
        super(ErrorType.CANNOT_START_GAME, undefined, "Cannot start game")
        this.reason = reason;
    }
}