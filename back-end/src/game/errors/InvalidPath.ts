import GameError from "./GameError";
import ErrorType from "./ErrorType";

export default class InvalidPath extends GameError
{
    constructor() {
        super(ErrorType.INVALID_PATH)
    }
}