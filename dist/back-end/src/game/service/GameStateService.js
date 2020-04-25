"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RepositoryService_1 = require("./RepositoryService");
class GameStateService extends RepositoryService_1.RepositoryService {
    gameState(gameId) {
        return this.findGame(gameId).getState();
    }
}
exports.GameStateService = GameStateService;
//# sourceMappingURL=GameStateService.js.map