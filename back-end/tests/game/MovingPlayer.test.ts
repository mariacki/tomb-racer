import 'mocha';
import assert from 'assert';
import { Tiles, TilePosition } from '../../src/game/model/tile';
import { GameTestContext, UserExample } from './GameTestContext';
import { ErrorType, InvalidPath, EventType, Position} from '../../../common';
import { Movement, CreateGame } from '../../src/game/contract';

describe('Moving Player', () => {
    const ctx = new GameTestContext();
    beforeEach(ctx.initializer());

    const movement = new  Movement(
        UserExample.first.userId,
        UserExample.first.gameId,
        [ new TilePosition(0, 1)]
    )

    it ('can only be done, when game is started', () => {
        const board = [[Tiles.startingPoint(), Tiles.startingPoint()]];
        const gameDef = new  CreateGame("Game Name");   
        ctx.gameService.createGame(gameDef, board);
        ctx.gameService.addPlayer(UserExample.first);
        ctx.gameService.addPlayer(UserExample.second);

        assert.throws(() => {
            ctx.gameService.executeMovement(movement)
        }, (error) => {
            assert.equal(error.type, ErrorType.GAME_NOT_STARTED_YET);
            return true;
        })
    })

    it ('can only be done by player whose turn is current', () => {
        ctx.startGame();
        const movement = new  Movement(
            UserExample.second.userId,
            UserExample.second.gameId,
            []
        )
        
        assert.throws(() => {
            ctx.gameService.executeMovement(movement);
        }, (error) => {
            assert.equal(error.type, ErrorType.INCORRECT_PLAYER_ACTION);
            return true;
        })
    })

    const exampleBoard = [
        [Tiles.startingPoint(), Tiles.startingPoint()],
        [Tiles.path(),          Tiles.startingPoint()],
        [Tiles.w(),          Tiles.path()]
    ]

    it ('cannot be done through walls', () => {
        ctx.randomResult = 3;
        const movement = new  Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            [
                 new TilePosition(1, 0), 
                 new TilePosition(2, 0),
                 new TilePosition(2, 1) 
            ]
        )
        ctx.startGame(exampleBoard);

        assert.throws(() => {
            ctx.gameService.executeMovement(movement)
        }, (error) => {
            assert.equal(error.type, ErrorType.INVALID_PATH)
            return true;
        })
    })

    it ('changes the player position', () => {
        ctx.randomResult = 1;
        const path = [ new TilePosition(0,1)]
        const movement = new  Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            path
        )
        ctx.startGame();

        ctx.gameService.executeMovement(movement);

        const game = ctx.gameRepositorySpy.lastPersistedGame.getState();
        const player = game.players[0];
        const event: any = ctx.eventDispatcher.eventsByType.get(EventType.PLAYER_MOVED)[0]
        assert.deepEqual(player.position,  {row: 0, col: 1});
        assert.equal(event.userId, UserExample.first.userId);
        assert.deepEqual(event.pathUsed, path);
    })

    it ('removes player health when path goes through spikes', () => {
        ctx.randomResult = 3;
        const boardWithSpikes = [
            [Tiles.startingPoint(), Tiles.startingPoint()],
            [Tiles.path(),          Tiles.startingPoint()],
            [Tiles.spikes(),        Tiles.path()]
        ]
        ctx.startGame(boardWithSpikes);
        const movement = new  Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            [
                 new TilePosition(1, 0), 
                 new TilePosition(2, 0),
                 new TilePosition(2, 1)
            ]
        )

        ctx.gameService.executeMovement(movement);

        const event: any = ctx.eventDispatcher.eventsByType.get(EventType.PLAYER_HIT)[0];
        assert.equal(event.origin, ctx.idProvider.ids[0])
        assert.equal(event.hpTaken, 20);
        assert.equal(event.currentHp, 80);
    })

    it ('movement finishes turn', () => {
        ctx.randomResult = 3;
        const boardWithSpikes = [
            [Tiles.startingPoint(), Tiles.startingPoint()],
            [Tiles.path(),          Tiles.startingPoint()],
            [Tiles.spikes(),        Tiles.path()]
        ]
        ctx.startGame(boardWithSpikes);
        const movement = new  Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            [
                 new TilePosition(1, 0), 
                 new TilePosition(2, 0),
                 new TilePosition(2, 1)
            ]
        )
        

        ctx.gameService.executeMovement(movement);

        const event: any = ctx.eventDispatcher.eventsByType.get(EventType.NEXT_TURN)[1];
    
        assert.equal(event.origin, UserExample.second.gameId);
        assert.equal(event.turn.currentlyPlaying, UserExample.second.userId);
        assert.equal(event.turn.stepPoints, ctx.randomResult);
    })

    it('sets first player again after last one moved', () => {
        ctx.randomResult = 1;
        const board = [
            [Tiles.startingPoint(), Tiles.startingPoint(), Tiles.startingPoint()],
            [Tiles.path(), Tiles.path(), Tiles.path()]
        ]
        ctx.startGame(board);

        const movement1 = new  Movement(UserExample.first.userId, UserExample.second.gameId, [ new TilePosition(1, 0)]);
        const movement2 = new  Movement(UserExample.second.userId, UserExample.second.gameId, [ new TilePosition(1, 1)]);
        const movement3 = new  Movement(UserExample.third.userId, UserExample.third.gameId, [ new TilePosition(1, 2)]);

        ctx.gameService.executeMovement(movement1);
        ctx.gameService.executeMovement(movement2);
        ctx.gameService.executeMovement(movement3);

        const event: any = ctx.eventDispatcher.eventsByType.get(EventType.NEXT_TURN)[3];
        assert.equal(event.turn.currentlyPlaying, UserExample.first.userId);
    })

    describe('Path', () => {
        it ('is invalid if its length does not equal current step points', () => {
            ctx.randomResult = 2;
            const movement = new  Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [ new TilePosition(0, 1)]
            )
            ctx.startGame(exampleBoard);
    
            assert.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert.equal(error.type, ErrorType.INVALID_PATH)
                return true;
            })
        });
    
        it ('is invalid if first position is equal to user position', () => {
            ctx.randomResult = 1;
            const movement = new  Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [ new TilePosition(0, 0)]
            )
            ctx.startGame(exampleBoard);
    
            assert.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert.equal(error.type, ErrorType.INVALID_PATH)
                return true;
            })
        })
    
        it ('is invalid if distance to the player position is > 1', () => {
            ctx.randomResult = 1;
            const movement  = new  Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [ new TilePosition(2, 1)]
            )
            ctx.startGame(exampleBoard);
    
            assert.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert.equal(error.type, ErrorType.INVALID_PATH);
                return true;
            })
        })

        it ('is invalid if first element is position diagonally to the palyer position', () => {
            ctx.randomResult = 1; 
            const movement = new  Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [ new TilePosition(1, 1)]
            )
            ctx.startGame(exampleBoard);

            assert.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert.equal(error.type, ErrorType.INVALID_PATH);
                return true;
            })
        })

        it ('is invalid if its elemtns are position diagonally to each other', () => {
            ctx.randomResult = 2;
            const movement = new  Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [ new TilePosition(0, 1),  new TilePosition(1, 0)]
            )
            ctx.startGame(exampleBoard);

            assert.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert.equal(error.type, ErrorType.INVALID_PATH);
                assert.equal(error.message, "Path steps are not adjacent");
                assert.deepEqual(error.invalidSteps[0], {row: 0, col: 1})
                assert.deepEqual(error.invalidSteps[1], {row: 1, col: 0})
                return true;
            })
        })

        it ('is not valid if distance between elements is > 1', () => {
            ctx.randomResult = 2;
            const movement = new  Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [ new TilePosition(0, 1),  new TilePosition(2, 1)]
            )
            ctx.startGame(exampleBoard);

            assert.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error: InvalidPath) => {
                assert.equal(error.message, "Path steps are not adjacent")
                assert.equal(error.type, ErrorType.INVALID_PATH);
                assert.deepEqual(error.invalidSteps[0], {row: 0, col: 1})
                assert.deepEqual(error.invalidSteps[1], {row: 2, col: 1})
                return true;
            })
        })
    })
})