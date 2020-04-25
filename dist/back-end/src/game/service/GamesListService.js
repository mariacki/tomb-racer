"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RepositoryService_1 = require("./RepositoryService");
class GamesListService extends RepositoryService_1.RepositoryService {
    gameList() {
        return this.gameRepository.findAll().map(game => {
            return {
                id: game.id,
                name: game.name
            };
        });
    }
}
exports.GamesListService = GamesListService;
//# sourceMappingURL=GamesListService.js.map