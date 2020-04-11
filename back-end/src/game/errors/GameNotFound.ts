import ErrorType from './ErrorType';
import GameError from './GameError';

export default class GameNotFound extends GameError
{
    gameId: string;

    constructor(gameId: string) {
        super(ErrorType.GAME_NOT_FOUND)
        this.gameId = gameId;
    }
}