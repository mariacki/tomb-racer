import ErrorType from './ErrorType';
import GameError from './GameError';

export default class GameNotStarted extends GameError
{
    gameId: string;

    constructor(gameId: string) {
        super(ErrorType.GAME_NOT_STARTED_YET);
        this.gameId = gameId;
    }
}