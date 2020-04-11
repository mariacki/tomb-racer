import 'mocha';
import assert from 'assert';
import { contract } from './../../src/game';
import { GameTestContext } from './GameTestContext';

describe('Joining Game', () => {
    const ctx = new GameTestContext();
    beforeEach(ctx.initializer());

    describe('New Player', () => {
        it ('cannot be added to the game that does not exists', () => {
            const player = new contract.DTO.AddPlayer(
                "non-existing-game-id",
                "some-user-id",
                "some-user-name"
            )
            const expectedError = {
                type: "GAME NOT FOUND",
                gameId: "non-existing-game-id"
            }

            assert.throws(() => {
                ctx.gameService.addPlayer(player);
            }, (error: Error) => {
                assert.deepEqual(error, expectedError);
                return true;
            })
        })
        
        it ('has userId and userName', () => {
            const player = new contract.DTO.AddPlayer(
                ctx.idProvider.ids[0],
                "some-user-id",
                "User Name"
            );
            const game = new contract.DTO.CreateGame("Some game name");
            ctx.gameService.createGame(game, []);

            ctx.gameService.addPlayer(player);
            
            const updatedGame = ctx.gameRepositorySpy.persistedGames[0];
            const newPlayer = updatedGame.players[0];
            assert.equal(player.userId, newPlayer.userId);
            assert.equal(player.userName, newPlayer.userName);
            assert.equal(updatedGame.id, ctx.idProvider.ids[0]);
        })
    })
})