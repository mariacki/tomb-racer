import GameError from './GameError';
import ErrorType from './ErrorType';

export default class UserNotFound extends GameError
{
    userId: string;

    constructor(userId: string) {
        super(ErrorType.USER_NOT_FOUND);
        this.userId = userId;
    }
}