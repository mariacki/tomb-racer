const assert = require('assert');
const example = require('./utils');
const {Game, Tail} = require('../src/core/game');

describe('Movement', () => {
    
    it('should be allowed only after game started', () => {
        const board = [[Tail.startingPoint(), Tail.walkable()]]
        const eventsListener = example.emptyEventsListener();
        const game = new Game({board, eventsListener});
        
        game.addPlayer(example.users.first);
        
        try {
            game.movePlayer(example.users.second.userId, {row: 0, col: 1});
            assert.fail();
        } catch (e) {
            assert.equal("CANNOT-MOVE-PLAYER-GAME-NOT-STARTED", e.type);
        }
    })

    it('should be only allowed for player whos turns is current', () => {
        const board = [
            [Tail.startingPoint(), Tail.walkable()],
            [Tail.startingPoint(), Tail.walkable()]
        ]
        const eventsListener = example.emptyEventsListener();
        const game = example.createStartedGame(eventsListener);

        try {
            game.movePlayer(example.users.second.userId, {row: 0, col: 1});
            assert.fail();
        } catch (e) {
            assert.equal("INVALID-USER-MOVING", e.type);
        }
    })

    
    it ('should place player on new posiiton', () => {
        
        const board = [
            [Tail.startingPoint(), Tail.walkable()],
            [Tail.startingPoint(), Tail.walkable()]
        ]
        const eventsListener = example.emptyEventsListener();
        const game = example.createStartedGame(eventsListener, board);
        let givenMovement;
        eventsListener.onPlayerMoved = (playerMoved) => givenMovement = playerMoved;

        game.movePlayer(example.users.first.userId, {row: 0, col: 1});

        assert.equal(example.users.first.userId, givenMovement.userId);
        assert.equal(1, givenMovement.newPosition.col);
        assert.equal(0, givenMovement.newPosition.row);
    });
    

    it ('should deduct movement points from player each time he moves', () => {
        const givenMovementEvents = [];
        const board = [
            [Tail.startingPoint(), Tail.walkable(), Tail.walkable(), Tail.walkable()],
            [Tail.startingPoint(), Tail.walkable(), Tail.walkable(), Tail.walkable()]
        ]
        const eventsListener = example.emptyEventsListener();
        const game = example.createStartedGame(eventsListener, board);
        eventsListener.onPlayerMoved = (playerMoved) => givenMovementEvents.push(playerMoved);

        game.movePlayer(example.users.first.userId, {row: 0, col: 3});
        game.movePlayer(example.users.first.userId, {row: 1, col: 2});

        assert.equal(2, givenMovementEvents[0].walkPoints);
        assert.equal(0, givenMovementEvents[1].walkPoints);
    })

    it ('counts path lengh considering walls', () => {
        let movementEvent;
        const board = [
            [Tail.startingPoint(), Tail.wall(), Tail.walkable()],
            [Tail.walkable(), Tail.walkable(), Tail.walkable()],
            [Tail.startingPoint(), Tail.wall(), Tail.wall()]
        ]
        const eventsListener = example.emptyEventsListener();
        const game = example.createStartedGame(eventsListener, board);
        eventsListener.onPlayerMoved = (playerMoved) => movementEvent = playerMoved;

        game.movePlayer(example.users.first.userId, {row: 0, col: 2});

    
        assert.equal(1, movementEvent.walkPoints);
    })

    it ('does not allow player to move further than his distance points', () => {
        const board = [
            [Tail.startingPoint(), Tail.startingPoint()],
            [Tail.walkable(), Tail.wall()],
            [Tail.walkable(), Tail.wall()],
            [Tail.walkable(), Tail.wall()],
            [Tail.walkable(), Tail.wall()],
            [Tail.walkable(), Tail.wall()],
            [Tail.walkable(), Tail.wall()],
        ]
        const eventsListener = example.emptyEventsListener();
        const game = example.createStartedGame(eventsListener, board);
        
        try {
            game.movePlayer(example.users.first.userId, {row: 6, col: 0});
            assert.fail();
        } catch (e) {
            assert.equal("MOVE-EXCEEDS-DISTANCE", e.type);
        }
    })
})