import ErrorType from './ErrorType';
import GameError from './GameError';

export default class InvalidBoard extends GameError
{
    constructor() {
        super(ErrorType.INVALID_BOARD);
    }
}