import ErrorType from './ErrorType';
import GameError from './GameError';

export default class GameStartedTwice extends GameError
{
    userId: string;

    constructor(userId: string) {
        super(ErrorType.GAME_STARTED_TWICE);
        this.userId = userId;
    }
}
