"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RepositoryService_1 = require("./RepositoryService");
class AddPlayerService extends RepositoryService_1.RepositoryService {
    constructor(gameRepository, event) {
        super(gameRepository);
        this.event = event;
    }
    addPlayer(request) {
        const game = super.findGame(request.gameId);
        const events = game.addPlayer(request);
        this.gameRepository.persist(game);
        events.forEach((event) => this.event.dispatch(event));
    }
}
exports.AddPlayerService = AddPlayerService;
//# sourceMappingURL=AddPlayerService.js.map