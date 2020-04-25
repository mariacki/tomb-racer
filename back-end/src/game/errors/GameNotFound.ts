import { 
    ErrorType,
} from '../../../../common';
import { GameError } from './GameError';

export class GameNotFound extends GameError
{
    gameId: string;

    constructor(gameId: string) {
        super(ErrorType.GAME_NOT_FOUND, gameId, "Could not found game")
        this.gameId = gameId;
    }
}