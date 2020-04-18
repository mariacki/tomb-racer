import { GameError } from ".";
import { Position, ErrorType, InvalidPath as IInvalidPath } from 'tr-common';

export class InvalidPath extends GameError implements IInvalidPath
{
    invalidSteps: Position[];

    constructor(gameId: string, invalidPath: Position[], message: string) {
        super(ErrorType.INVALID_PATH, gameId, message);
        this.invalidSteps = invalidPath;
    }
}