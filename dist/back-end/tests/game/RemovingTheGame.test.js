"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const GameTestContext_1 = require("./GameTestContext");
const game_1 = require("../../src/game");
const common_1 = require("../../../common");
describe('Removing the came', () => {
    let ctx = new GameTestContext_1.GameTestContext();
    const defaultBoard = [[game_1.Tiles.startingPoint(), game_1.Tiles.startingPoint()]];
    beforeEach(ctx.initializer());
    it('causes game do disappear from the game list', () => {
        const gameDef = new game_1.CreateGame("some game");
        const gameId = ctx.gameService.createGame(gameDef, defaultBoard);
        ctx.gameService.removeGame(gameId);
        const gameList = ctx.gameService.gameList();
        assert_1.default.equal(gameList.length, 0);
    });
    it('dispatches the game removed event', () => {
        const gameDef = new game_1.CreateGame("some game");
        const gameId = ctx.gameService.createGame(gameDef, defaultBoard);
        ctx.gameService.removeGame(gameId);
        const event = ctx.eventDispatcher.eventsByType.get(common_1.EventType.GAME_REMOVED)[0];
        assert_1.default.equal(event.gameId, gameId);
    });
});
//# sourceMappingURL=RemovingTheGame.test.js.map