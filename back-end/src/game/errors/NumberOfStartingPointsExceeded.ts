import { 
    ErrorType,
    StartingPointsExceeded
} from 'tr-common/events';
import GameError from './GameError';

export default class NumberOfStartingPointsExceeded extends GameError implements StartingPointsExceeded
{
    maxNumberOfPlayers: number;

    constructor(maxNumberOfPlayers: number, gameId: string) {
        super(ErrorType.NUMBER_OF_STARTING_POINTS_EXCEEDED, gameId, "Number of starting points exceeded");
        this.maxNumberOfPlayers = maxNumberOfPlayers;    
    }
}