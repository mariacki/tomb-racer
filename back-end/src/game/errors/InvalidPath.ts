import GameError from "./GameError";
import ErrorType from "./ErrorType";

export default class InvalidPath extends GameError
{
    constructor(message: string) {
        super(ErrorType.INVALID_PATH, message);
    }
}