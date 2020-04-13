import GameError from "./GameError";
import { 
    ErrorType,
    InvalidPath as IInvalidPath
} from 'tr-common/events';
import { Position } from 'tr-common/data_types';

export default class InvalidPath extends GameError implements IInvalidPath
{
    invalidSteps: Position[];

    constructor(gameId: string, invalidPath: Position[], message: string) {
        super(ErrorType.INVALID_PATH, gameId, message);
        this.invalidSteps = invalidPath;
    }
}