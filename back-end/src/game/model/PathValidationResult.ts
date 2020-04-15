import { Position } from 'tr-common/data_types'; 

export class PathValidationResult {
    isValid: boolean;
    invalidPath: Position[];
    message: string;

    constructor(isValid: boolean, invalidPath: Position[], message: string) {
        this.isValid = isValid;
        this.invalidPath = invalidPath;
        this.message = message;
    }
}