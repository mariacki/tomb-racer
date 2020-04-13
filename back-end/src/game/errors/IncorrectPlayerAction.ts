import GameError from "./GameError";
import { 
    ErrorType,
    IncorretPlayerAction as IIncorretPlayerAction
} from 'tr-common/events';

export default class IncorrectPlayerAction extends GameError implements IIncorretPlayerAction 
{
    gameId: string;
    playerExecutedAction: string;
    playerThatShouldExecuteAction: string;

    constructor(
        gameId: string,
        playerExecutedAction: string,
        playerThatShouldExecuteAction: string
    ) {
        super(
            ErrorType.INCORRECT_PLAYER_ACTION, 
            undefined,
            "Inorrect Player Action"
        );

        this.gameId = gameId;
        this.playerExecutedAction = playerExecutedAction;
        this.playerThatShouldExecuteAction = playerThatShouldExecuteAction;
    }
    
}