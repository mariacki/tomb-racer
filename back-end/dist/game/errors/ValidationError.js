"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ValidationError extends _1.GameError {
    constructor(type, field, message = "Validatoin Error") {
        super(type, message);
        this.type = type;
        this.field = field;
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map