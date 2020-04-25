"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const dto_1 = require("../../src/game/contract/dto");
const tile_1 = require("../../src/game/model/tile");
const GameTestContext_1 = require("./GameTestContext");
const common_1 = require("../../../common");
describe('Starting the game', () => {
    const ctx = new GameTestContext_1.GameTestContext();
    const defaultBoard = [[tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()]];
    beforeEach(ctx.initializer());
    it('cannot be done on game that does not exists', () => {
        assert_1.default.throws(() => {
            ctx.gameService.startRequest(GameTestContext_1.UserExample.first);
        }, (error) => {
            assert_1.default.equal(error.type, common_1.ErrorType.CANNOT_START_GAME);
            assert_1.default.equal(error.reason.type, common_1.ErrorType.GAME_NOT_FOUND);
            assert_1.default.equal(error.reason.gameId, GameTestContext_1.UserExample.first.gameId);
            return true;
        });
    });
    it('cannot be done by the user that is not in the game', () => {
        const gameDef = new dto_1.CreateGame("Some Game");
        ctx.gameService.createGame(gameDef, defaultBoard);
        assert_1.default.throws(() => {
            ctx.gameService.startRequest(GameTestContext_1.UserExample.second);
        }, (error) => {
            assert_1.default.equal(error.type, common_1.ErrorType.CANNOT_START_GAME);
            assert_1.default.equal(error.reason.type, common_1.ErrorType.USER_NOT_FOUND);
            assert_1.default.equal(error.reason.searchedUser, GameTestContext_1.UserExample.second.userId);
            return true;
        });
    }),
        it('cannot be done by the same user twice', () => {
            const gameDef = new dto_1.CreateGame("Some game");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
            assert_1.default.throws(() => {
                ctx.gameService.startRequest(GameTestContext_1.UserExample.first);
                ctx.gameService.startRequest(GameTestContext_1.UserExample.first);
            }, (error) => {
                console.log("ERROR", error);
                assert_1.default.equal(error.type, "CANNOT START GAME");
                assert_1.default.equal(error.reason.type, "GAME STARTED TWICE");
                assert_1.default.equal(error.reason.userId, GameTestContext_1.UserExample.first.userId);
                return true;
            });
        });
    it('only can be done when all player request start the game', () => {
        const gameDef = new dto_1.CreateGame("some-game");
        ctx.gameService.createGame(gameDef, defaultBoard);
        ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
        ctx.gameService.addPlayer(GameTestContext_1.UserExample.second);
        ctx.gameService.addPlayer(GameTestContext_1.UserExample.third);
        ctx.gameService.startRequest(GameTestContext_1.UserExample.first);
        ctx.gameService.startRequest(GameTestContext_1.UserExample.third);
        const events = ctx.eventDispatcher.dispatchedEvents;
        assert_1.default.equal(events.length, 4);
        assert_1.default.equal(events[0].type, common_1.EventType.GAME_CREATED);
        assert_1.default.equal(events[1].type, common_1.EventType.PLAYER_JOINED);
        assert_1.default.equal(events[2].type, common_1.EventType.PLAYER_JOINED);
        assert_1.default.equal(events[3].type, common_1.EventType.PLAYER_JOINED);
    });
    it('changes the game state when all users start the game', () => {
        ctx.startGame();
        const updatedGame = ctx.gameRepositorySpy.persistedGames[0];
        assert_1.default.equal(updatedGame.state, "STARTED");
    });
    it('sends the event when game is started', () => {
        ctx.startGame();
        const events = ctx.eventDispatcher.dispatchedEvents;
        assert_1.default.equal(events[4].type, common_1.EventType.NEXT_TURN);
        assert_1.default.equal(events[4].origin, "id1");
    });
    it('sets turn to the current user', () => {
        ctx.randomResult = 5;
        const expectedTurn = {
            currentlyPlaying: GameTestContext_1.UserExample.first.userId,
            stepPoints: ctx.randomResult
        };
        ctx.startGame();
        const game = ctx.gameRepositorySpy.persistedGames[0];
        const event = ctx.eventDispatcher.eventsByType.get(common_1.EventType.NEXT_TURN)[0];
        assert_1.default.deepEqual(game.currentTurn.currentlyPlaying, GameTestContext_1.UserExample.first.userId);
        assert_1.default.deepEqual(event.turn, expectedTurn);
    });
    it('does not have any effect on game already started', () => {
        const gameDef = new dto_1.CreateGame("Some Game");
        ctx.gameService.createGame(gameDef, defaultBoard);
        ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
        ctx.gameService.addPlayer(GameTestContext_1.UserExample.second);
        ctx.gameService.startRequest(GameTestContext_1.UserExample.first);
        ctx.gameService.startRequest(GameTestContext_1.UserExample.second);
        ctx.gameService.addPlayer(GameTestContext_1.UserExample.third);
        ctx.gameService.startRequest(GameTestContext_1.UserExample.third);
        assert_1.default.equal(ctx.eventDispatcher.eventsByType.get(common_1.EventType.NEXT_TURN).length, 1);
    });
});
//# sourceMappingURL=StartingGame.test.js.map