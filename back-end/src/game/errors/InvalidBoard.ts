import { ErrorType, MinNumberOfStartingPointsNotReached } from '../../../../common/events';
import { GameError } from '.';

export class InvalidBoard extends GameError implements MinNumberOfStartingPointsNotReached
{
    minNumberOfStartingPoints: number = 2;
    
    constructor() {
        super(
            ErrorType.INVALID_BOARD, 
            undefined, 
            "Board does not have at least 2 stargin points"
        );
    }
}