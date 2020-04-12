import ErrorType from './ErrorType';

export default class GameError extends Error
{
    type: ErrorType;

    constructor(type: ErrorType, message: string) {
        super(message);
        this.type = type;
    }
}