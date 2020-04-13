import GameError from './GameError';
import { ErrorType } from 'tr-common/events';

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