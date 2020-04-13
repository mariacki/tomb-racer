import { 
    ErrorType,
} from 'tr-common/events';
import GameError from './GameError';

export default class GameNotStarted extends GameError 
{
    constructor(gameId: string) {
        super(
            ErrorType.GAME_NOT_STARTED_YET, 
            gameId,
            "Game not started yet"
        );
    }
}