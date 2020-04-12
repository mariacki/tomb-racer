import GameError from './GameError';
import ErrorType from './ErrorType';

export default class CannotStartGame extends GameError
{
    reason: GameError;

    constructor(reason: GameError) {
        super(ErrorType.CANNOT_START_GAME, "Cannot Start Game")
        this.reason = reason;
    }
}