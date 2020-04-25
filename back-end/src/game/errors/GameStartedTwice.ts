import { ErrorType, GameStartedTwiceBySinglePlayer } from '../../../../common/events';
import { GameError } from '.';

export class GameStartedTwice extends GameError implements GameStartedTwiceBySinglePlayer
{
    userId: string;

    constructor(userId: string, gameId: string) {
        super(
            ErrorType.GAME_STARTED_TWICE,
            gameId,
            "Game started twice by a single user"
        );
        this.userId = userId;
    }
}
