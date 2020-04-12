import GameError from "./GameError";
import ErrorType from "./ErrorType";

export default class IncorrectPlayerAction extends GameError
{
    gameId: string;
    userThatShouldPlay: string;
    userThatTriedToPlay: string;

    constructor(
        gameId: string,
        userThatShouldPlay: string,
        userThatTriedToPlay: string
    ) {
        super(ErrorType.INCORRECT_PLAYER_ACTION, "Inorrect Player Action");
        this.gameId = gameId;
        this.userThatShouldPlay = userThatShouldPlay;
        this.userThatTriedToPlay = userThatTriedToPlay;
    }
}