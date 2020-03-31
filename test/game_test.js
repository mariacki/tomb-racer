const assert = require('assert');
const {Game, Tail} = require('./../src/game');


describe('New Game', () => {
    
    const userExample = {
        userId: 1,
        userName: "test-user"
    }

    describe('Players Joining Game', () => {
        let game = null;
        let board = [];
        let eventsListener = {};

        beforeEach((done) => {
            board = [[Tail.startingPoint()]];
            eventsListener = {};

            done();
        })

        let addPlayer = (user) => {
            let addedPlayer = null;
            eventsListener.onPlayerAdded = (player) => addedPlayer = player;

            game.addPlayer(user);

            return addedPlayer;
        }

        it ('have userId', () => {
            game = new Game({board, eventsListener});
            const addedPlayer = addPlayer(userExample);

            assert.equal(1, addedPlayer.userId);
        })

        it ('have username', () => {
            game = new Game({board, eventsListener});
            const addedPlayer = addPlayer(userExample); 

            assert.equal("test-user", addedPlayer.userName);
        })

        it ('have initial HP', () => {
            game = new Game({board, eventsListener});
            const addedPlayer = addPlayer(userExample); 

            assert.equal(100, addedPlayer.hp);
        })

        it ('have empty inventory', () => {
            game = new Game({board, eventsListener});
            const addedPlayer = addPlayer(userExample);

            assert.deepStrictEqual([], addedPlayer.inventory);
        })

        it ('should have positions of starting points on the board', () => {
            board = [
                [Tail.startingPoint(), Tail.startingPoint()],
                [Tail.startingPoint()]
            ]
            game = new Game({board, eventsListener});
            
            const playerOne = addPlayer({userId: 1, userName: "a"});
            const playerTwo = addPlayer({userId: 2, userName: "a"});
            const playerThree = addPlayer({userId: 3, userName: "a"});

            assert.deepStrictEqual({row: 0, col: 0}, playerOne.position);
            assert.deepStrictEqual({row: 0, col: 1}, playerTwo.position);
            assert.deepStrictEqual({row: 1, col: 0}, playerThree.position);                    
       })
    })
})