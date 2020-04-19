import 'mocha';
import assert from 'assert';
import { Tiles } from '../../src/game/model/tile';
import { GameTestContext, UserExample } from './GameTestContext';
import { EventType, ErrorType, PlayerJoined } from 'tr-common';
import { GameNotFound } from '../../src/game/errors';
import { CreateGame } from '../../src/game/contract';

describe('Leaving the game', () => {
    const ctx = new GameTestContext();
    const defaultBoard = [[Tiles.startingPoint(), Tiles.startingPoint()]];

    beforeEach(ctx.initializer());
    
    describe('Leaving the game in general', () => {
        it ('does not allow to player to leave if game does not exists', () => {
            ctx.gameService.createGame(new CreateGame("First Game"), defaultBoard);
            
            assert.throws(() => {
                ctx.gameService.removePlayer(UserExample.invalidGameId);
            }, (err: GameNotFound) => {
                assert.equal(err.type, ErrorType.GAME_NOT_FOUND);111
                assert.equal(err.origin, "non-existing")
                return true;
            })
        })

        it ('removes player from the list', () => {
            const gameDef = new  CreateGame("Some Name");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(UserExample.first);
            ctx.gameService.addPlayer(UserExample.second);

            ctx.gameService.removePlayer(UserExample.first);

            const players = ctx.gameRepositorySpy.persistedGames[0].getState().players;

            assert.equal(players.length, 1);
        })

        it ('sends PLAYER LEFT event', () => {
            const gameDef = new  CreateGame("Some Game");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(UserExample.first);

            ctx.gameService.removePlayer(UserExample.first);

            const event = ctx.eventDispatcher.dispatchedEvents[2];

            assert.deepEqual(event, {
                isError: false,
                type: EventType.PLAYER_LEFT,
                origin: "id1",
                userId: UserExample.first.userId
            })
        })

        it ('reuses the starting ponts', () => {
            const gameDef = new CreateGame("Some Game");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(UserExample.first);
            ctx.gameService.addPlayer(UserExample.second);

            ctx.gameService.removePlayer(UserExample.first);
            ctx.gameService.addPlayer(UserExample.third);

            const event = <PlayerJoined>ctx.eventDispatcher.eventsByType.get(EventType.PLAYER_JOINED)[2];

            assert.equal(event.player.position.row, 0);
            assert.equal(event.player.position.col, 0);
        })
    })
})