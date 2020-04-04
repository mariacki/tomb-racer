const assert = require('assert');
const example = require('./utils');
const {Game, Tail} = require('../src/core/game');

describe('Moving', () => {
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

    it('should place player on new posiiton', () => {
        const expectedMovement = {
            userId: example.users.first.userId,
            newPosition: {row: 0, col: 1}
        }
        const board = [
            [Tail.startingPoint(), Tail.walkable()],
            [Tail.startingPoint(), Tail.walkable()]
        ]
        const eventsListener = example.emptyEventsListener();
        const game = example.createStartedGame(eventsListener);
        let givenMovement;
        eventsListener.onPlayerMoved = (playerMoved) => givenMovement = playerMoved;

        game.movePlayer(example.users.first.userId, {row: 0, col: 1});

        assert.deepEqual(expectedMovement, givenMovement);
    });

    it ('should allow player to move only by his range', () => {
        
    })
})