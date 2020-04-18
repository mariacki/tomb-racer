import { GameError } from '.';
import { ErrorType } from 'tr-common';

export class ValidationError extends GameError
{
    field: string;
    
    constructor(type: ErrorType, field: string, message: string = "Validatoin Error")
    {
        super(type, message);
        this.type = type;
        this.field = field;
    }
}