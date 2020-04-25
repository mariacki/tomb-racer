"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const tile_1 = require("../../src/game/model/tile");
const GameTestContext_1 = require("./GameTestContext");
const game_1 = require("../../src/game");
describe('Game data', () => {
    const ctx = new GameTestContext_1.GameTestContext();
    beforeEach(ctx.initializer());
    it('Can provide data for single game', () => {
        const gameDef = new game_1.CreateGame("Some Game");
        ctx.gameService.createGame(gameDef, [[tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()]]);
        const gameState = ctx.gameService.gameState("id1");
        assert_1.default.deepEqual(gameState, {
            id: "id1",
            name: "Some Game",
            players: [],
            currentTurn: {},
            board: [
                [{ type: "STARTING_POINT" }, { type: "STARTING_POINT" }]
            ]
        });
    });
    it('Can provide games list', () => {
        const game1 = new game_1.CreateGame("Game One");
        const game2 = new game_1.CreateGame("Game 2");
        const board = [[tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()]];
        ctx.gameService.createGame(game1, board);
        ctx.gameService.createGame(game2, board);
        const gameList = ctx.gameService.gameList();
        assert_1.default.equal(gameList[0].id, "id1");
        assert_1.default.equal(gameList[0].name, "Game One");
        assert_1.default.equal(gameList[1].id, "id2");
        assert_1.default.equal(gameList[1].name, "Game 2");
    });
});
//# sourceMappingURL=GameData.test.js.map