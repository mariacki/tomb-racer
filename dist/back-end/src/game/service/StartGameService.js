"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const RepositoryService_1 = require("./RepositoryService");
class StartGameService extends RepositoryService_1.RepositoryService {
    constructor(gameRepository, eventDispatcher, random) {
        super(gameRepository);
        this.event = eventDispatcher;
        this.random = random;
    }
    startRequest(request) {
        try {
            const game = this.findGame(request.gameId);
            game.addStartRequest(request.userId);
            if (!game.isReadyToStart()) {
                return;
            }
            const diceRoll = this.random(1, 6);
            const events = game.start(diceRoll);
            events.forEach((event) => this.event.dispatch(event));
            this.persistGame(game);
        }
        catch (gameError) {
            throw new errors_1.CannotStartGame(gameError);
        }
    }
}
exports.StartGameService = StartGameService;
//# sourceMappingURL=StartGameService.js.map