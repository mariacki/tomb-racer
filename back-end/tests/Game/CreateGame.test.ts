import 'mocha';
import assert from 'assert';
import { contract, Tiles } from './../../src/game';
import { GameTestContext } from './GameTestContext';
import { 
    GameNameDuplicated, 
    ErrorType,
    MinNumberOfStartingPointsNotReached
} from 'tr-common/events';

describe('New Game', () => {
    const ctx = new GameTestContext();
    const validBoard = [[Tiles.startingPoint(), Tiles.startingPoint()]];

    beforeEach(ctx.initializer());

    const validationError = (type: string, field: string) => {
        return (error: Error) => {
            assert.deepEqual(error, {type, field});
            return true;
        }
    }
    
    describe('Validation', () => {    
        it('shoudl not create game if name is not unique', () => {
            const firstGame = new contract.DTO.CreateGame("a name");
            const secondGame = new contract.DTO.CreateGame("a name");

            assert.throws(() => {
                ctx.gameService.createGame(firstGame, validBoard);
                ctx.gameService.createGame(secondGame, validBoard)
            }, (error: GameNameDuplicated) => {
                assert.equal(error.isError, true);
                assert.equal(error.gameName, firstGame.gameName);
                assert.equal(error.origin, undefined);
                assert.equal(error.type, ErrorType.FIELD_NOT_UNIQUE)
                return true;
            })
        })

        it ('cannot be created with board without at least two starting points', () => {
            const gameDef = new contract.DTO.CreateGame("Some game");

            assert.throws(() => {
                ctx.gameService.createGame(gameDef, [[Tiles.startingPoint()]])
            }, (error: MinNumberOfStartingPointsNotReached) => {
                assert.equal(error.isError, true);
                assert.equal(error.origin, undefined),
                assert.equal(error.type, ErrorType.INVALID_BOARD),
                assert.equal(error.minNumberOfStartingPoints, 2)
                return true;
            })
        })
    })

    describe('Newly Created Game', () => {
        it ('has unique id', () => {
            const someGame = new contract.DTO.CreateGame('Game name');

            ctx.gameService.createGame(someGame, validBoard);

            const game = ctx.gameRepositorySpy.addedGames[0];
            assert.equal(game.id, ctx.idProvider.ids[0]);
        })

        it ('has empty player list', () => {
            const someGame = new contract.DTO.CreateGame("Game name");

            ctx.gameService.createGame(someGame, validBoard);

            const game = ctx.gameRepositorySpy.addedGames[0];
            assert.deepEqual(game.players, []);
        })

        it ('has WAITING FOR PLAYERS state', () => {
            const someGame = new contract.DTO.CreateGame("Game name");

            ctx.gameService.createGame(someGame, validBoard);

            const game = ctx.gameRepositorySpy.addedGames[0];
            assert.equal(game.state, "WAITING FOR PLAYERS");
        })

        it ('dispatches the GAME_CREATED event', () => {
            const someGame = new contract.DTO.CreateGame("Game name");
            const expectedEvent = {
                type: contract.events.EventType.GAME_CREATED,
                data: {
                    gameId: "id1",
                    gameName: "Game name",
                    numberOfPlayers: 0
                }
            }

            ctx.gameService.createGame(someGame, validBoard);

            const event = ctx.eventDispatcher.dispatchedEvents[0];
            assert.deepEqual(event, expectedEvent);
        })
    })
})