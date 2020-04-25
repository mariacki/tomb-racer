import { GameError } from ".";
import { Position, ErrorType, InvalidPath as IInvalidPath } from '../../../../common';

export class InvalidPath extends GameError implements IInvalidPath
{
    invalidSteps: Position[];

    constructor(invalidPath: Position[], message: string) {
        super(ErrorType.INVALID_PATH, undefined, message);
        this.invalidSteps = invalidPath;
    }
}