"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserConnectionSpy {
    constructor() {
        this.receivedMessages = [];
    }
    send(message) {
        this.receivedMessages.push(message);
    }
}
exports.UserConnectionSpy = UserConnectionSpy;
//# sourceMappingURL=UserConnectionSpy.js.map