import 'mocha';
import assert from 'assert';
import { contract, Tiles } from './../../src/game';
import { GameTestContext, UserExample } from './GameTestContext';

describe('Joining Game', () => {
    const ctx = new GameTestContext();
    const defaultBoard = [[Tiles.startingPoint(), Tiles.startingPoint()]]
    beforeEach(ctx.initializer());

    describe('New Player', () => {
        it ('cannot be added to the game that does not exists', () => {
            const player = UserExample.invalidGameId;
            const expectedError = {
                type: "GAME NOT FOUND",
                gameId: "non-existing"
            }

            assert.throws(() => {
                ctx.gameService.addPlayer(player);
            }, (error: Error) => {
                assert.deepEqual(error, expectedError);
                return true;
            })
        });

        it ('cannot be added if there is not enough starting point on the board', () => {
            const expectedError = {
                type: "NUMBER OF STARTING POINTS EXCEEDED",
                maxNumberOfPlayers: 2
            }

            ctx.gameService.createGame(
                new contract.DTO.CreateGame("Some name"), 
                defaultBoard
            );
        
            assert.throws(() => {
                ctx.gameService.addPlayer(UserExample.first);
                ctx.gameService.addPlayer(UserExample.second);
                ctx.gameService.addPlayer(UserExample.third);
            }, (error: Error) => {
                assert.deepEqual(error, expectedError);
                return true;
            })
        })
        
        it ('has basic data', () => {
            const player = UserExample.first;
            const game = new contract.DTO.CreateGame("Some game name");
            ctx.gameService.createGame(game, defaultBoard);

            ctx.gameService.addPlayer(player);
            
            const updatedGame = ctx.gameRepositorySpy.persistedGames[0];
            const newPlayer = updatedGame.players[0];
            
            assert.equal(newPlayer.hp, 100);
            assert.deepEqual(newPlayer.inventory, []);
            assert.equal(newPlayer.userId, player.userId);
            assert.equal(newPlayer.userName, player.userName);
        })

        it ('is placed at a first free starting point', () => {
            const game = new contract.DTO.CreateGame("Some game");
            ctx.gameService.createGame(game, defaultBoard);

            ctx.gameService.addPlayer(UserExample.first);
            ctx.gameService.addPlayer(UserExample.second);

            const firstPlayer = ctx.gameRepositorySpy.persistedGames[1].players[0];
            const secondPlayer = ctx.gameRepositorySpy.persistedGames[1].players[1];

            assert.deepEqual(firstPlayer.position, {row: 0, col: 0});
            assert.deepEqual(secondPlayer.position, {row: 0, col: 1});
        })

        it ('should be passed in an event', () => {
            const player = UserExample.first;
            const game = new contract.DTO.CreateGame("Some game name");
            ctx.gameService.createGame(game, defaultBoard);

            ctx.gameService.addPlayer(player);

            const event = ctx.eventDispatcher.dispatchedEvents[1];

            assert.deepEqual(event, {
                type: contract.events.EventType.PLAYER_JOINED,
                data: {
                    gameId: player.gameId,
                    player: {
                        userId: player.userId,
                        userName: player.userName,
                        hp: 100, 
                        inventory: []
                    }
                }
            })
        })

    })
})