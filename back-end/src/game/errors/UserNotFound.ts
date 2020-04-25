import { GameError } from '.';
import { ErrorType, UserNotFoundInGame } from '../../../../common';

export class UserNotFound extends GameError implements UserNotFoundInGame
{
    searchedUser: string;

    constructor(userId: string) {
        super(ErrorType.USER_NOT_FOUND, "Could not found users");
        this.searchedUser = userId;
    }
}