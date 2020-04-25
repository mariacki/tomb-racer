"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const tile_1 = require("../../src/game/model/tile");
const GameTestContext_1 = require("./GameTestContext");
const dto_1 = require("../../src/game/contract/dto");
const common_1 = require("../../../common");
describe('Finishing game', () => {
    const board = [
        [tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()],
        [tile_1.Tiles.finishPoint(), tile_1.Tiles.path(), tile_1.Tiles.path()]
    ];
    const ctx = new GameTestContext_1.GameTestContext();
    ctx.randomResult = 1;
    beforeEach(ctx.initializer());
    it('happens when player stands on finish tile', () => {
        const movement = new dto_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [new dto_1.Position(1, 0)]);
        ctx.startGame(board);
        ctx.gameService.executeMovement(movement);
        const game = ctx.gameRepositorySpy.lastPersistedGame;
        const event = ctx.eventDispatcher.eventsByType.get(common_1.EventType.GAME_FINISHED)[0];
        assert_1.default.equal(game.state, "FINISHED");
        assert_1.default.equal(event.origin, GameTestContext_1.UserExample.first.gameId);
        assert_1.default.equal(event.userId, GameTestContext_1.UserExample.first.userId);
    });
});
//# sourceMappingURL=FinishingGame.test.js.map