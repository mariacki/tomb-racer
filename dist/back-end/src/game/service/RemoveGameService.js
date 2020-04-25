"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../common");
class RemoveGameService {
    constructor(repository, eventDispatcher) {
        this.repository = repository;
        this.eventDispatcher = eventDispatcher;
    }
    removeGame(gameId) {
        this.repository.remove(gameId);
        const event = {
            isError: false,
            origin: undefined,
            type: common_1.EventType.GAME_REMOVED,
            gameId
        };
        this.eventDispatcher.dispatch(event);
    }
}
exports.RemoveGameService = RemoveGameService;
//# sourceMappingURL=RemoveGameService.js.map