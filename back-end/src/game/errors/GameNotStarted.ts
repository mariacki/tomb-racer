import { ErrorType } from 'tr-common'
import { GameError } from '.';

export class GameNotStarted extends GameError 
{
    constructor(gameId: string) {
        super(
            ErrorType.GAME_NOT_STARTED_YET, 
            gameId,
            "Game not started yet"
        );
    }
}