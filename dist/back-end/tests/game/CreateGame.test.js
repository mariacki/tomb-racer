"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const tile_1 = require("./../../src/game/model/tile");
const GameTestContext_1 = require("./GameTestContext");
const contract_1 = require("../../src/game/contract");
const common_1 = require("../../../common");
const common_2 = require("../../../common");
describe('New Game', () => {
    const ctx = new GameTestContext_1.GameTestContext();
    const validBoard = [[tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()]];
    beforeEach(ctx.initializer());
    describe('Validation', () => {
        it('shoudl not create game if name is not unique', () => {
            const firstGame = new contract_1.CreateGame("a name");
            const secondGame = new contract_1.CreateGame("a name");
            assert_1.default.throws(() => {
                ctx.gameService.createGame(firstGame, validBoard);
                ctx.gameService.createGame(secondGame, validBoard);
            }, (error) => {
                console.log(error);
                assert_1.default.equal(error.isError, true);
                assert_1.default.equal(error.gameName, firstGame.gameName);
                assert_1.default.equal(error.origin, undefined);
                assert_1.default.equal(error.type, common_1.ErrorType.FIELD_NOT_UNIQUE);
                return true;
            });
        });
        it('cannot be created with board without at least two starting points', () => {
            const gameDef = new contract_1.CreateGame("Some game");
            assert_1.default.throws(() => {
                ctx.gameService.createGame(gameDef, [[tile_1.Tiles.startingPoint()]]);
            }, (error) => {
                assert_1.default.equal(error.isError, true);
                assert_1.default.equal(error.origin, undefined),
                    assert_1.default.equal(error.type, common_1.ErrorType.INVALID_BOARD),
                    assert_1.default.equal(error.minNumberOfStartingPoints, 2);
                return true;
            });
        });
    });
    describe('Newly Created Game', () => {
        it('has unique id', () => {
            const someGame = new contract_1.CreateGame('Game name');
            ctx.gameService.createGame(someGame, validBoard);
            const game = ctx.gameRepositorySpy.addedGames[0].getState();
            assert_1.default.equal(game.id, ctx.idProvider.ids[0]);
        });
        it('has empty player list', () => {
            const someGame = new contract_1.CreateGame("Game name");
            ctx.gameService.createGame(someGame, validBoard);
            const game = ctx.gameRepositorySpy.addedGames[0].getState();
            assert_1.default.deepEqual(game.players, []);
        });
        it('dispatches the GAME_CREATED event', () => {
            const someGame = new contract_1.CreateGame("Game name");
            ctx.gameService.createGame(someGame, validBoard);
            const event = ctx.eventDispatcher.dispatchedEvents[0];
            assert_1.default.equal(event.type, common_2.EventType.GAME_CREATED);
        });
        it('returns id of created game', () => {
            const someGame = new contract_1.CreateGame("Game name");
            const gameId = ctx.gameService.createGame(someGame, validBoard);
            assert_1.default.equal(gameId, "id1");
        });
    });
});
//# sourceMappingURL=CreateGame.test.js.map