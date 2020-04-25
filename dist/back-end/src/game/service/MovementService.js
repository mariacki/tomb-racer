"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RepositoryService_1 = require("./RepositoryService");
class MovementService extends RepositoryService_1.RepositoryService {
    constructor(gameRepository, context) {
        super(gameRepository);
        this.context = context;
    }
    executeMovement(movement) {
        const game = super.findGame(movement.gameId);
        const events = [];
        events.push(...game.executeMovement(movement, this.context));
        if (game.canBeFinished()) {
            events.push(...game.finish());
        }
        else {
            events.push(...game.startNextTurn(this.context.rnd(1, 6)));
        }
        events.forEach((event) => this.context.eventDispatcher.dispatch(event));
        super.persistGame(game);
    }
}
exports.MovementService = MovementService;
//# sourceMappingURL=MovementService.js.map