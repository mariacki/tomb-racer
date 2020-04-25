"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
class RepositoryService {
    constructor(gameRepository) {
        this.gameRepository = gameRepository;
    }
    findGame(gameId) {
        const game = this.gameRepository.findById(gameId);
        if (!game) {
            throw new errors_1.GameNotFound(gameId);
        }
        return game;
    }
    persistGame(game) {
        this.gameRepository.persist(game);
    }
}
exports.RepositoryService = RepositoryService;
//# sourceMappingURL=RepositoryService.js.map