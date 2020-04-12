import 'mocha';
import assert from 'assert';
import { contract, Tiles } from '../../src/game';
import { GameTestContext, UserExample } from './GameTestContext';
import { EventType } from '../../src/game/contract/Events';
import Position from '../../src/game/contract/dto/Position';
import { ErrorType } from '../../src/game/errors';

describe('Moving Player', () => {
    const ctx = new GameTestContext();
    beforeEach(ctx.initializer());

    const movement = new contract.DTO.Movement(
        UserExample.first.userId,
        UserExample.first.gameId,
        [new Position(0, 1)]
    )

    it ('can only be done, when game is started', () => {
        const board = [[Tiles.startingPoint(), Tiles.startingPoint()]];
        const gameDef = new contract.DTO.CreateGame("Game Name");   
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
        const movement = new contract.DTO.Movement(
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
        [Tiles.wall(),          Tiles.path()]
    ]

    it ('cannot be done through walls', () => {
        ctx.randomResult = 3;
        const movement = new contract.DTO.Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            [
                new Position(1, 0), 
                new Position(2, 0),
                new Position(2, 1) 
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
        const path = [new Position(0,1)]
        const movement = new contract.DTO.Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            path
        )
        ctx.startGame();

        ctx.gameService.executeMovement(movement);

        const game = ctx.gameRepositorySpy.lastPersistedGame;
        const player = game.players[0];
        const event = ctx.eventDispatcher.eventsByType.get(EventType.PLAYER_MOVED)[0]
        assert.deepEqual(player.position, new Position(0, 1));
        assert.equal(event.data.userId, UserExample.first.userId);
        assert.deepEqual(event.data.position, player.position);
        assert.deepEqual(event.data.path, path);
    })

    it ('removes player health when path goes through spikes', () => {
        ctx.randomResult = 3;
        const boardWithSpikes = [
            [Tiles.startingPoint(), Tiles.startingPoint()],
            [Tiles.path(),          Tiles.startingPoint()],
            [Tiles.spikes(),        Tiles.path()]
        ]
        ctx.startGame(boardWithSpikes);
        const movement = new contract.DTO.Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            [
                new Position(1, 0), 
                new Position(2, 0),
                new Position(2, 1)
            ]
        )

        ctx.gameService.executeMovement(movement);

        const game = ctx.gameRepositorySpy.lastPersistedGame;
        const event = ctx.eventDispatcher.eventsByType.get(EventType.PLAYER_HIT)[0];
        assert.equal(game.players[0].hp, 80);
        assert.equal(event.data.hpTaken, 20);
        assert.equal(event.data.currentHp, 80);
    })

    it ('movement finishes turn', () => {
        ctx.randomResult = 3;
        const boardWithSpikes = [
            [Tiles.startingPoint(), Tiles.startingPoint()],
            [Tiles.path(),          Tiles.startingPoint()],
            [Tiles.spikes(),        Tiles.path()]
        ]
        ctx.startGame(boardWithSpikes);
        const movement = new contract.DTO.Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            [
                new Position(1, 0), 
                new Position(2, 0),
                new Position(2, 1)
            ]
        )
        

        ctx.gameService.executeMovement(movement);

        const event = ctx.eventDispatcher.eventsByType.get(EventType.NEXT_TURN)[0];
    
        assert.equal(event.data.gameId, UserExample.second.gameId);
        assert.equal(event.data.turn.userId, UserExample.second.userId);
        assert.equal(event.data.turn.stepPoints, ctx.randomResult);
    })

    describe('Path', () => {
        it ('is invalid if its length does not equal current step points', () => {
            ctx.randomResult = 2;
            const movement = new contract.DTO.Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [new Position(0, 1)]
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
            const movement = new contract.DTO.Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [new Position(0, 0)]
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
            const movement  = new contract.DTO.Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [new Position(2, 1)]
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
            const movement = new contract.DTO.Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [new Position(1, 1)]
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
            const movement = new contract.DTO.Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [new Position(0, 1), new Position(1, 0)]
            )
            ctx.startGame(exampleBoard);

            assert.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert.equal(error.type, ErrorType.INVALID_PATH);
                assert.equal(error.message, "Path element: (1, 0) is not adjacent to (0, 1)")
                return true;
            })
        })

        it ('is not valid if distance between elements is > 1', () => {
            ctx.randomResult = 2;
            const movement = new contract.DTO.Movement(
                UserExample.first.userId,
                UserExample.first.gameId,
                [new Position(0, 1), new Position(2, 1)]
            )
            ctx.startGame(exampleBoard);

            assert.throws(() => {
                ctx.gameService.executeMovement(movement);
            }, (error) => {
                assert.equal(error.type, ErrorType.INVALID_PATH);
                assert.equal(error.message, `Path element: (2, 1) is not adjacent to (0, 1)`)
                return true;
            })
        })
    })
})