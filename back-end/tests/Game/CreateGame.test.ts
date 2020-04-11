import 'mocha';
import assert from 'assert';
import { contract } from './../../src/game';
import { GameTestContext } from './GameTestContext';

describe('New Game', () => {
    const ctx = new GameTestContext();

    beforeEach(ctx.initializer());

    const validationError = (type: string, field: string) => {
        return (error: Error) => {
            assert.deepEqual(error, {type, field});
            return true;
        }
    }
    
    describe('Validation', () => {
        it ('should not create game without name specified', () => {
            const invalidCommand = new contract.DTO.CreateGame("");
    
            assert.throws(() => {
                ctx.gameService.createGame(invalidCommand, []);
            }, validationError("FIELD REQUIRED", "gameName"));
        });
    
        it('shoudl not create game if name is not unique', () => {
            const firstGame = new contract.DTO.CreateGame("a name");
            const secondGame = new contract.DTO.CreateGame("a name");
    
            assert.throws(() => {
                ctx.gameService.createGame(firstGame, []);
                ctx.gameService.createGame(secondGame, []);
            }, validationError("FIELD NOT UNIQUE", "gameName"))
        })
    })

    describe('Newly Created Game', () => {
        it ('has unique id', () => {
            const someGame = new contract.DTO.CreateGame('Game name');

            ctx.gameService.createGame(someGame, []);

            const game = ctx.gameRepositorySpy.addedGames[0];
            assert.equal(game.id, ctx.idProvider.ids[0]);
        })

        it ('has empty player list', () => {
            const someGame = new contract.DTO.CreateGame("Game name");

            ctx.gameService.createGame(someGame, []);

            const game = ctx.gameRepositorySpy.addedGames[0];
            assert.deepEqual(game.players, []);
        })

        it ('has WAITING FOR PLAYERS state', () => {
            const someGame = new contract.DTO.CreateGame("Game name");

            ctx.gameService.createGame(someGame, []);

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

            ctx.gameService.createGame(someGame, []);

            const event = ctx.eventDispatcher.dispatchedEvents[0];
            assert.deepEqual(event, expectedEvent);
        })
    })
})