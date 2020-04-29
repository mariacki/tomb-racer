import 'mocha';
import assert from 'assert';
import { Tiles } from '../../src/game/model/tile';
import { GameTestContext, UserExample } from './GameTestContext';
import { EventType, ErrorType, PlayerJoined, TurnStarted } from '../../../common';
import { GameNotFound } from '../../src/game/errors';
import { CreateGame, Movement } from '../../src/game/contract';

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
                assert.equal(err.type, ErrorType.GAME_NOT_FOUND);
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
            ctx.gameService.removePlayer(UserExample.second);

            const players = ctx.gameRepositorySpy.persistedGames[0].getState().players;

            assert.equal(players.length, 0);
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

        it ('sets the turn to the next player if the removed player has turn', () => {
            const gameDef = new  CreateGame("Some Name");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(UserExample.first);
            ctx.gameService.addPlayer(UserExample.second);
            ctx.gameService.startRequest(UserExample.first);
            ctx.gameService.startRequest(UserExample.second);

            ctx.gameService.removePlayer(UserExample.first);

            const events = <TurnStarted[]>ctx.eventDispatcher.eventsByType.get(EventType.NEXT_TURN);
            assert.equal(events.length, 2);
            assert.equal(events[1].turn.currentlyPlaying, UserExample.second.userId);
        })

        it ('does not set next turn if its last player', () => {
            const gameDef = new  CreateGame("Some Game");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(UserExample.first);
            ctx.gameService.startRequest(UserExample.first);

            ctx.gameService.removePlayer(UserExample.first);

            const events = ctx.eventDispatcher.eventsByType.get(EventType.NEXT_TURN);

            assert.equal(events.length, 1)
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