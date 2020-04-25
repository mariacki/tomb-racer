"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const tile_1 = require("../../src/game/model/tile");
const GameTestContext_1 = require("./GameTestContext");
const common_1 = require("../../../common");
const contract_1 = require("../../src/game/contract");
describe('Leaving the game', () => {
    const ctx = new GameTestContext_1.GameTestContext();
    const defaultBoard = [[tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()]];
    beforeEach(ctx.initializer());
    describe('Leaving the game in general', () => {
        it('does not allow to player to leave if game does not exists', () => {
            ctx.gameService.createGame(new contract_1.CreateGame("First Game"), defaultBoard);
            assert_1.default.throws(() => {
                ctx.gameService.removePlayer(GameTestContext_1.UserExample.invalidGameId);
            }, (err) => {
                assert_1.default.equal(err.type, common_1.ErrorType.GAME_NOT_FOUND);
                111;
                assert_1.default.equal(err.origin, "non-existing");
                return true;
            });
        });
        it('removes player from the list', () => {
            const gameDef = new contract_1.CreateGame("Some Name");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.second);
            ctx.gameService.removePlayer(GameTestContext_1.UserExample.first);
            const players = ctx.gameRepositorySpy.persistedGames[0].getState().players;
            assert_1.default.equal(players.length, 1);
        });
        it('sends PLAYER LEFT event', () => {
            const gameDef = new contract_1.CreateGame("Some Game");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
            ctx.gameService.removePlayer(GameTestContext_1.UserExample.first);
            const event = ctx.eventDispatcher.dispatchedEvents[2];
            assert_1.default.deepEqual(event, {
                isError: false,
                type: common_1.EventType.PLAYER_LEFT,
                origin: "id1",
                userId: GameTestContext_1.UserExample.first.userId
            });
        });
        it('reuses the starting ponts', () => {
            const gameDef = new contract_1.CreateGame("Some Game");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.second);
            ctx.gameService.removePlayer(GameTestContext_1.UserExample.first);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.third);
            const event = ctx.eventDispatcher.eventsByType.get(common_1.EventType.PLAYER_JOINED)[2];
            assert_1.default.equal(event.player.position.row, 0);
            assert_1.default.equal(event.player.position.col, 0);
        });
    });
});
//# sourceMappingURL=LeavingTheGame.test.js.map