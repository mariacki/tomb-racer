import 'mocha';
import assert from 'assert';
import { Tiles } from './../../src/game/model/tile';
import { GameTestContext } from './GameTestContext';
import { CreateGame } from '../../src/game/contract'
import { 
    GameNameDuplicated, 
    ErrorType,
    MinNumberOfStartingPointsNotReached
} from '../../../common';
import { EventType, GameCreated } from '../../../common';

describe('New Game', () => {
    const ctx = new GameTestContext();
    const validBoard = [[Tiles.startingPoint(), Tiles.startingPoint()]];

    beforeEach(ctx.initializer());
    
    describe('Validation', () => {    
        it('shoudl not create game if name is not unique', () => {
            const firstGame = new  CreateGame("a name");
            const secondGame = new  CreateGame("a name");

            assert.throws(() => {
                ctx.gameService.createGame(firstGame, validBoard);
                ctx.gameService.createGame(secondGame, validBoard)
            }, (error: GameNameDuplicated) => {
                console.log(error);
                assert.equal(error.isError, true);
                assert.equal(error.gameName, firstGame.gameName);
                assert.equal(error.origin, undefined);
                assert.equal(error.type, ErrorType.FIELD_NOT_UNIQUE)
                return true;
            })
        })

        it ('cannot be created with board without at least two starting points', () => {
            const gameDef = new  CreateGame("Some game");

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
            const someGame = new  CreateGame('Game name');

            ctx.gameService.createGame(someGame, validBoard);

            const game = ctx.gameRepositorySpy.addedGames[0].getState();
            assert.equal(game.id, ctx.idProvider.ids[0]);
        })

        it ('has empty player list', () => {
            const someGame = new  CreateGame("Game name");

            ctx.gameService.createGame(someGame, validBoard);

            const game = ctx.gameRepositorySpy.addedGames[0].getState();
            assert.deepEqual(game.players, []);
        })

        it ('dispatches the GAME_CREATED event', () => {
            const someGame = new  CreateGame("Game name");

            ctx.gameService.createGame(someGame, validBoard);

            const event = <GameCreated>ctx.eventDispatcher.dispatchedEvents[0];
            assert.equal(event.type, EventType.GAME_CREATED);
        })

        it ('returns id of created game', () => {
            const someGame = new CreateGame("Game name");

            const gameId = ctx.gameService.createGame(someGame, validBoard);

            assert.equal(gameId, "id1");
        })
    })
})