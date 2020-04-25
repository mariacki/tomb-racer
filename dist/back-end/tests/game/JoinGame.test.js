"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const tile_1 = require("./../../src/game/model/tile");
const GameTestContext_1 = require("./GameTestContext");
const game_1 = require("../../src/game");
const common_1 = require("../../../common");
describe('Joining Game', () => {
    const ctx = new GameTestContext_1.GameTestContext();
    const defaultBoard = [[tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()]];
    beforeEach(ctx.initializer());
    describe('New Player', () => {
        it('cannot be added to the game that does not exists', () => {
            const player = GameTestContext_1.UserExample.invalidGameId;
            assert_1.default.throws(() => {
                ctx.gameService.addPlayer(player);
            }, (error) => {
                assert_1.default.equal(error.type, common_1.ErrorType.GAME_NOT_FOUND);
                assert_1.default.equal(error.gameId, "non-existing");
                return true;
            });
        });
        it('cannot be added if there is not enough starting point on the board', () => {
            ctx.gameService.createGame(new game_1.CreateGame("Some name"), defaultBoard);
            assert_1.default.throws(() => {
                ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
                ctx.gameService.addPlayer(GameTestContext_1.UserExample.second);
                ctx.gameService.addPlayer(GameTestContext_1.UserExample.third);
            }, (error) => {
                assert_1.default.deepEqual(error.type, common_1.ErrorType.NUMBER_OF_STARTING_POINTS_EXCEEDED);
                assert_1.default.deepEqual(error.maxNumberOfPlayers, 2);
                return true;
            });
        });
        it('has basic data', () => {
            const player = GameTestContext_1.UserExample.first;
            const game = new game_1.CreateGame("Some game name");
            ctx.gameService.createGame(game, defaultBoard);
            ctx.gameService.addPlayer(player);
            const updatedGame = ctx.gameRepositorySpy.persistedGames[0].getState();
            const newPlayer = updatedGame.players[0];
            assert_1.default.equal(newPlayer.hp, 100);
            assert_1.default.equal(newPlayer.userId, player.userId);
            assert_1.default.equal(newPlayer.userName, player.userName);
        });
        it('is placed at a first free starting point', () => {
            const game = new game_1.CreateGame("Some game");
            ctx.gameService.createGame(game, defaultBoard);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.second);
            const gameState = ctx.gameRepositorySpy.persistedGames[1].getState();
            const firstPlayer = gameState.players[0];
            const secondPlayer = gameState.players[1];
            assert_1.default.deepEqual(firstPlayer.position, { row: 0, col: 0 });
            assert_1.default.deepEqual(secondPlayer.position, { row: 0, col: 1 });
        });
        it('should be passed in an event', () => {
            const player = GameTestContext_1.UserExample.first;
            const game = new game_1.CreateGame("Some game name");
            ctx.gameService.createGame(game, defaultBoard);
            ctx.gameService.addPlayer(player);
            const event = ctx.eventDispatcher.dispatchedEvents[1];
            assert_1.default.equal(event.type, common_1.EventType.PLAYER_JOINED);
        });
    });
});
//# sourceMappingURL=JoinGame.test.js.map