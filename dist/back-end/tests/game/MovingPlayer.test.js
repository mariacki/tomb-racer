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
describe('Moving Player', () => {
    const ctx = new GameTestContext_1.GameTestContext();
    beforeEach(ctx.initializer());
    const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [new tile_1.TilePosition(0, 1)]);
    it('can only be done, when game is started', () => {
        const board = [[tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()]];
        const gameDef = new contract_1.CreateGame("Game Name");
        ctx.gameService.createGame(gameDef, board);
        ctx.gameService.addPlayer(GameTestContext_1.UserExample.first);
        ctx.gameService.addPlayer(GameTestContext_1.UserExample.second);
        assert_1.default.throws(() => {
            ctx.gameService.executeMovement(movement);
        }, (error) => {
            assert_1.default.equal(error.type, common_1.ErrorType.GAME_NOT_STARTED_YET);
            return true;
        });
    });
    it('can only be done by player whose turn is current', () => {
        ctx.startGame();
        const movement = new contract_1.Movement(GameTestContext_1.UserExample.second.userId, GameTestContext_1.UserExample.second.gameId, []);
        assert_1.default.throws(() => {
            ctx.gameService.executeMovement(movement);
        }, (error) => {
            assert_1.default.equal(error.type, common_1.ErrorType.INCORRECT_PLAYER_ACTION);
            return true;
        });
    });
    const exampleBoard = [
        [tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()],
        [tile_1.Tiles.path(), tile_1.Tiles.startingPoint()],
        [tile_1.Tiles.wall(), tile_1.Tiles.path()]
    ];
    it('cannot be done through walls', () => {
        ctx.randomResult = 3;
        const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [
            new tile_1.TilePosition(1, 0),
            new tile_1.TilePosition(2, 0),
            new tile_1.TilePosition(2, 1)
        ]);
        ctx.startGame(exampleBoard);
        assert_1.default.throws(() => {
            ctx.gameService.executeMovement(movement);
        }, (error) => {
            assert_1.default.equal(error.type, common_1.ErrorType.INVALID_PATH);
            return true;
        });
    });
    it('changes the player position', () => {
        ctx.randomResult = 1;
        const path = [new tile_1.TilePosition(0, 1)];
        const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, path);
        ctx.startGame();
        ctx.gameService.executeMovement(movement);
        const game = ctx.gameRepositorySpy.lastPersistedGame.getState();
        const player = game.players[0];
        const event = ctx.eventDispatcher.eventsByType.get(common_1.EventType.PLAYER_MOVED)[0];
        assert_1.default.deepEqual(player.position, { row: 0, col: 1 });
        assert_1.default.equal(event.userId, GameTestContext_1.UserExample.first.userId);
        assert_1.default.deepEqual(event.pathUsed, path);
    });
    it('removes player health when path goes through spikes', () => {
        ctx.randomResult = 3;
        const boardWithSpikes = [
            [tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()],
            [tile_1.Tiles.path(), tile_1.Tiles.startingPoint()],
            [tile_1.Tiles.spikes(), tile_1.Tiles.path()]
        ];
        ctx.startGame(boardWithSpikes);
        const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [
            new tile_1.TilePosition(1, 0),
            new tile_1.TilePosition(2, 0),
            new tile_1.TilePosition(2, 1)
        ]);
        ctx.gameService.executeMovement(movement);
        const event = ctx.eventDispatcher.eventsByType.get(common_1.EventType.PLAYER_HIT)[0];
        assert_1.default.equal(event.origin, ctx.idProvider.ids[0]);
        assert_1.default.equal(event.hpTaken, 20);
        assert_1.default.equal(event.currentHp, 80);
    });
    it('movement finishes turn', () => {
        ctx.randomResult = 3;
        const boardWithSpikes = [
            [tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()],
            [tile_1.Tiles.path(), tile_1.Tiles.startingPoint()],
            [tile_1.Tiles.spikes(), tile_1.Tiles.path()]
        ];
        ctx.startGame(boardWithSpikes);
        const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [
            new tile_1.TilePosition(1, 0),
            new tile_1.TilePosition(2, 0),
            new tile_1.TilePosition(2, 1)
        ]);
        ctx.gameService.executeMovement(movement);
        const event = ctx.eventDispatcher.eventsByType.get(common_1.EventType.NEXT_TURN)[1];
        assert_1.default.equal(event.origin, GameTestContext_1.UserExample.second.gameId);
        assert_1.default.equal(event.turn.currentlyPlaying, GameTestContext_1.UserExample.second.userId);
        assert_1.default.equal(event.turn.stepPoints, ctx.randomResult);
    });
    it('sets first player again after last one moved', () => {
        ctx.randomResult = 1;
        const board = [
            [tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()],
            [tile_1.Tiles.path(), tile_1.Tiles.path(), tile_1.Tiles.path()]
        ];
        ctx.startGame(board);
        const movement1 = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.second.gameId, [new tile_1.TilePosition(1, 0)]);
        const movement2 = new contract_1.Movement(GameTestContext_1.UserExample.second.userId, GameTestContext_1.UserExample.second.gameId, [new tile_1.TilePosition(1, 1)]);
        const movement3 = new contract_1.Movement(GameTestContext_1.UserExample.third.userId, GameTestContext_1.UserExample.third.gameId, [new tile_1.TilePosition(1, 2)]);
        ctx.gameService.executeMovement(movement1);
        ctx.gameService.executeMovement(movement2);
        ctx.gameService.executeMovement(movement3);
        const event = ctx.eventDispatcher.eventsByType.get(common_1.EventType.NEXT_TURN)[3];
        assert_1.default.equal(event.turn.currentlyPlaying, GameTestContext_1.UserExample.first.userId);
    });
    describe('Path', () => {
        it('is invalid if its length does not equal current step points', () => {
            ctx.randomResult = 2;
            const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [new tile_1.TilePosition(0, 1)]);
            ctx.startGame(exampleBoard);
            assert_1.default.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert_1.default.equal(error.type, common_1.ErrorType.INVALID_PATH);
                return true;
            });
        });
        it('is invalid if first position is equal to user position', () => {
            ctx.randomResult = 1;
            const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [new tile_1.TilePosition(0, 0)]);
            ctx.startGame(exampleBoard);
            assert_1.default.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert_1.default.equal(error.type, common_1.ErrorType.INVALID_PATH);
                return true;
            });
        });
        it('is invalid if distance to the player position is > 1', () => {
            ctx.randomResult = 1;
            const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [new tile_1.TilePosition(2, 1)]);
            ctx.startGame(exampleBoard);
            assert_1.default.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert_1.default.equal(error.type, common_1.ErrorType.INVALID_PATH);
                return true;
            });
        });
        it('is invalid if first element is position diagonally to the palyer position', () => {
            ctx.randomResult = 1;
            const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [new tile_1.TilePosition(1, 1)]);
            ctx.startGame(exampleBoard);
            assert_1.default.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert_1.default.equal(error.type, common_1.ErrorType.INVALID_PATH);
                return true;
            });
        });
        it('is invalid if its elemtns are position diagonally to each other', () => {
            ctx.randomResult = 2;
            const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [new tile_1.TilePosition(0, 1), new tile_1.TilePosition(1, 0)]);
            ctx.startGame(exampleBoard);
            assert_1.default.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert_1.default.equal(error.type, common_1.ErrorType.INVALID_PATH);
                assert_1.default.equal(error.message, "Path steps are not adjacent");
                assert_1.default.deepEqual(error.invalidSteps[0], { row: 0, col: 1 });
                assert_1.default.deepEqual(error.invalidSteps[1], { row: 1, col: 0 });
                return true;
            });
        });
        it('is not valid if distance between elements is > 1', () => {
            ctx.randomResult = 2;
            const movement = new contract_1.Movement(GameTestContext_1.UserExample.first.userId, GameTestContext_1.UserExample.first.gameId, [new tile_1.TilePosition(0, 1), new tile_1.TilePosition(2, 1)]);
            ctx.startGame(exampleBoard);
            assert_1.default.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert_1.default.equal(error.message, "Path steps are not adjacent");
                assert_1.default.equal(error.type, common_1.ErrorType.INVALID_PATH);
                assert_1.default.deepEqual(error.invalidSteps[0], { row: 0, col: 1 });
                assert_1.default.deepEqual(error.invalidSteps[1], { row: 2, col: 1 });
                return true;
            });
        });
    });
});
//# sourceMappingURL=MovingPlayer.test.js.map