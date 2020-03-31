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

        const addPlayer = (user) => {
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

        it ('have positions of starting points on the board', () => {
            board = [
                [Tail.startingPoint(), Tail.startingPoint()],
                [Tail.startingPoint()]
            ]
            game = new Game({board, eventsListener});
            
            const playerOne = addPlayer({userId: 1, userName: "a"});
            const playerTwo = addPlayer({userId: 2, userName: "b"});
            const playerThree = addPlayer({userId: 3, userName: "c"});
        
            assert.deepEqual({row: 0, col: 0}, playerOne.position);
            assert.deepEqual({row: 0, col: 1}, playerTwo.position);
            assert.deepEqual({row: 1, col: 0}, playerThree.position);                    
       })

       it ('are not be accepted if all starting points are taken', () => {
            const board = [[Tail.startingPoint()], [Tail.startingPoint()]]
            const eventsListener = {
                onPlayerAdded() {}
            }
            game = new Game({board, eventsListener});
           
            game.addPlayer({userId: 1, userName: "a"});
            game.addPlayer({userId: 2, userName: "b"})

            try {
                game.addPlayer({userId: 1, userName: "a"});
                assert.fail();
            } catch (err) {
                assert.equal("JOIN-ERROR", err.type);
            }
       });

       it ('are showed on game state', () => {
           const board = [[Tail.startingPoint()]];
           const eventsListener = {
               onPlayerAdded() {}
           }
           const game = new Game({board, eventsListener});

           game.addPlayer({userId: 1, userName: "a"});

           const gameState = game.state();

           assert.equal(1, gameState.players.length);
       })
    })

    describe('Game Start Request', () => {
        it ('should start game when last player requests start', () => {
            let eventStarted;
            const board = [[Tail.startingPoint(), Tail.startingPoint()]]
            const eventsListener = {
                onPlayerAdded() {},
                onGameStarted(evt) {eventStarted = evt}
            }
            const game = new Game({board, eventsListener});

            game.addPlayer({userId: 1});
            game.addPlayer({userId: 2});

            game.requestStart(1);
            game.requestStart(2);

            assert.equal("GAME-STARTED", eventStarted.type);
        })
    })
})