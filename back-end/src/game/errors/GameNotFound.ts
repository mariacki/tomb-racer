import { 
    ErrorType,
} from 'tr-common/events';
import GameError from './GameError';

export default class GameNotFound extends GameError
{
    gameId: string;

    constructor(gameId: string) {
        super(ErrorType.GAME_NOT_FOUND, undefined, "Could not found game")
        this.gameId = gameId;
    }
}