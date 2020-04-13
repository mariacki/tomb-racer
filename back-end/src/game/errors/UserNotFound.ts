import GameError from './GameError';
import { 
    ErrorType,
    UserNotFoundInGame
} from 'tr-common/events';

export default class UserNotFound extends GameError implements UserNotFoundInGame
{
    searchedUser: string;

    constructor(userId: string) {
        super(ErrorType.USER_NOT_FOUND, "Could not found users");
        this.searchedUser = userId;
    }
}