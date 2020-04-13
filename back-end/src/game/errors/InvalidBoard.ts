import { 
    ErrorType,
    MinNumberOfStartingPointsNotReached
} from 'tr-common/events';

import GameError from './GameError';

export default class InvalidBoard extends GameError implements MinNumberOfStartingPointsNotReached
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