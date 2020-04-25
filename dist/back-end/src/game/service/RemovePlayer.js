"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RepositoryService_1 = require("./RepositoryService");
class RemovePlayerService extends RepositoryService_1.RepositoryService {
    constructor(gameRepository, event) {
        super(gameRepository);
        this.event = event;
    }
    removePlayer(request) {
        const game = this.findGame(request.gameId);
        const events = game.removePlayer(request.userId);
        this.gameRepository.persist(game);
        events.forEach(event => this.event.dispatch(event));
    }
}
exports.RemovePlayerService = RemovePlayerService;
//# sourceMappingURL=RemovePlayer.js.map