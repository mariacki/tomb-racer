"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const tr_common_1 = require("tr-common");
class UserNotFound extends _1.GameError {
    constructor(userId) {
        super(tr_common_1.ErrorType.USER_NOT_FOUND, "Could not found users");
        this.searchedUser = userId;
    }
}
exports.UserNotFound = UserNotFound;
//# sourceMappingURL=UserNotFound.js.map