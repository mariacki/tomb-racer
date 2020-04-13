import { ErrorType, ErrorEvent } from 'tr-common/events';
import { GameId } from 'tr-common/data_types';

export default class GameError extends Error implements ErrorEvent
{
    type: ErrorType;
    isError: boolean;
    origin: string | undefined;
    
    constructor(
        type: ErrorType, 
        origin: string = undefined, 
        message = ""
    ) {
        super(message);
        this.type = type;
        this.isError = true;
        this.origin = origin;
    } 
}