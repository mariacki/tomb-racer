import ErrorType from './ErrorType';
import GameError from './GameError';

export default class ValidationError extends GameError
{
    field: string;
    
    constructor(type: ErrorType, field: string, message: string = "Validatoin Error")
    {
        super(type, message);
        this.type = type;
        this.field = field;
    }
}