"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RepositoryService_1 = require("./RepositoryService");
class GameListService extends RepositoryService_1.RepositoryService {
    constructor(gameRepository) {
        super(gameRepository);
    }
    gameList() {
        return this.gameRepository.findAll().map(game => {
            return {
                id: game.id,
                name: game.name
            };
        });
    }
}
exports.GameListService = GameListService;
//# sourceMappingURL=GameListService.js.map