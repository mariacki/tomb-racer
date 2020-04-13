import 'mocha';
import assert from 'assert';
import { contract, Tiles } from '../../src/game';
import { GameTestContext, UserExample } from './GameTestContext';
import { EventType } from '../../src/game/contract/Events';
import { UserNotFoundInGame, CannotStartGame, ErrorType } from 'tr-common/events';

describe('Starting the game', () => {
    const ctx = new GameTestContext();
    const defaultBoard = [[Tiles.startingPoint(), Tiles.startingPoint(), Tiles.startingPoint()]];
    
    beforeEach(ctx.initializer());

    it ('cannot be done on game that does not exists', () => {
        assert.throws(() => {
            ctx.gameService.startRequest(UserExample.first);
        }, (error) => {
            assert.equal(error.type, ErrorType.CANNOT_START_GAME);
            assert.equal(error.reason.type, ErrorType.GAME_NOT_FOUND);
            assert.equal(error.reason.gameId, UserExample.first.gameId)
            return true;
        })
    })

    it ('cannot be done by the user that is not in the game', () => {
        const gameDef = new contract.DTO.CreateGame("Some Game");
        ctx.gameService.createGame(gameDef, defaultBoard);

        assert.throws(() => {
            ctx.gameService.startRequest(UserExample.second);
        }, (error) => {
            assert.equal(error.type, ErrorType.CANNOT_START_GAME);
            assert.equal(error.reason.type, ErrorType.USER_NOT_FOUND);
            assert.equal(error.reason.searchedUser, UserExample.second.userId)
            return true;
        })
    }), 

    it ('cannot be done by the same user twice', () => {
        const gameDef = new contract.DTO.CreateGame("Some game");
        ctx.gameService.createGame(gameDef, defaultBoard); 

        ctx.gameService.addPlayer(UserExample.first);

        assert.throws(() => {
            ctx.gameService.startRequest(UserExample.first);
            ctx.gameService.startRequest(UserExample.first);
        }, (error) => {
            assert.equal(error.type, "CANNOT START GAME");
            assert.equal(error.reason.type, "GAME STARTED TWICE")
            assert.equal(error.reason.userId, UserExample.first.userId);
            return true;
        })
    })

    it ('only can be done when all player request start the game', () => {
        const gameDef = new contract.DTO.CreateGame("some-game");
        ctx.gameService.createGame(gameDef, defaultBoard);
        ctx.gameService.addPlayer(UserExample.first);
        ctx.gameService.addPlayer(UserExample.second);
        ctx.gameService.addPlayer(UserExample.third);

        ctx.gameService.startRequest(UserExample.first);
        ctx.gameService.startRequest(UserExample.third);
             
        const events = ctx.eventDispatcher.dispatchedEvents;

        assert.equal(events.length, 4);
        assert.equal(events[0].type, EventType.GAME_CREATED);
        assert.equal(events[1].type, EventType.PLAYER_JOINED);
        assert.equal(events[2].type, EventType.PLAYER_JOINED);
        assert.equal(events[3].type, EventType.PLAYER_JOINED);
    })

    it ('changes the game state when all users start the game', () => {
        ctx.startGame();

        const updatedGame = ctx.gameRepositorySpy.persistedGames[0];
        assert.equal(updatedGame.state, "STARTED");
    })

    it ('sends the event when game is started', () => {
        ctx.startGame();

        const events = ctx.eventDispatcher.dispatchedEvents;
        assert.equal(events[4].type, EventType.GAME_STARTED);
        assert.equal(events[4].data.gameId, "id1")
    })

    it ('sets turn to the current user', () => {
        ctx.randomResult = 5
        const expectedTurn = {
            userId: UserExample.first.userId,
            actionPoints: 3, 
            stepPoints: ctx.randomResult
        }
        ctx.startGame();
        
        const game = ctx.gameRepositorySpy.persistedGames[0];
        const event = ctx.eventDispatcher.dispatchedEvents[4];

        assert.deepEqual(game.currentTurn, expectedTurn);
        assert.deepEqual(event.data.turn, expectedTurn);
    })
})