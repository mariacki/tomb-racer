import 'mocha';
import assert from 'assert';
import { Tiles } from './../../src/game/model/tile';
import { GameTestContext, UserExample } from './GameTestContext';
import { NumberOfStartingPointsExceeded } from '../../src/game/errors';
import { ErrorType } from 'tr-common/events';
import { CreateGame } from '../../src/game';
import { EventType } from 'tr-common';

describe('Joining Game', () => {
    const ctx = new GameTestContext();
    const defaultBoard = [[Tiles.startingPoint(), Tiles.startingPoint()]]
    beforeEach(ctx.initializer());

    describe('New Player', () => {
        it ('cannot be added to the game that does not exists', () => {
            const player = UserExample.invalidGameId;

            assert.throws(() => {
                ctx.gameService.addPlayer(player);
            }, (error) => {
                assert.equal(error.type, ErrorType.GAME_NOT_FOUND);
                assert.equal(error.gameId, "non-existing")
                return true;
            })
        });

        it ('cannot be added if there is not enough starting point on the board', () => {
            ctx.gameService.createGame(
                new  CreateGame("Some name"), 
                defaultBoard
            );
        
            assert.throws(() => {
                ctx.gameService.addPlayer(UserExample.first);
                ctx.gameService.addPlayer(UserExample.second);
                ctx.gameService.addPlayer(UserExample.third);
            }, (error: NumberOfStartingPointsExceeded) => {
                assert.deepEqual(error.type, ErrorType.NUMBER_OF_STARTING_POINTS_EXCEEDED);
                assert.deepEqual(error.maxNumberOfPlayers, 2)
                return true;
            })
        })
        
        it ('has basic data', () => {
            const player = UserExample.first;
            const game = new  CreateGame("Some game name");
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
            const game = new  CreateGame("Some game");
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
            const game = new  CreateGame("Some game name");
            ctx.gameService.createGame(game, defaultBoard);

            ctx.gameService.addPlayer(player);

            const event = ctx.eventDispatcher.dispatchedEvents[1];
            assert.equal(event.type, EventType.PLAYER_JOINED)
        })

    })
})