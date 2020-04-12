import ErrorType from './ErrorType';
import GameError from './GameError';

export default class NumberOfStartingPointsExceeded extends GameError
{
    maxNumberOfPlayers: number;

    constructor(maxNumberOfPlayers: number) {
        super(ErrorType.NUMBER_OF_STARTING_POINTS_EXCEEDED, "Number of starting points exceeded");
        this.maxNumberOfPlayers = maxNumberOfPlayers;    
    }
}