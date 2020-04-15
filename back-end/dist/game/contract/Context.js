"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Context {
    constructor(eventDispatcher, idProvider, repository, rnd) {
        this.eventDispatcher = eventDispatcher;
        this.idProvider = idProvider;
        this.rnd = rnd;
        this.repository = repository;
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map