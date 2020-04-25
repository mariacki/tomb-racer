import { ErrorType, StartingPointsExceeded } from '../../../../common';
import { GameError } from '.';

export class NumberOfStartingPointsExceeded extends GameError implements StartingPointsExceeded
{
    maxNumberOfPlayers: number;

    constructor(maxNumberOfPlayers: number, gameId: string) {
        super(ErrorType.NUMBER_OF_STARTING_POINTS_EXCEEDED, gameId, "Number of starting points exceeded");
        this.maxNumberOfPlayers = maxNumberOfPlayers;    
    }
}