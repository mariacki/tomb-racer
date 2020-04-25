"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdProviderMock {
    constructor() {
        this.ids = ["id1", "id2", "id3"];
        this.cur = 0;
    }
    newId() {
        return this.ids[this.cur++];
    }
}
exports.IdProviderMock = IdProviderMock;
//# sourceMappingURL=IdProviderMock.js.map