const assert = require('assert');
const {Game, Tail} = require('../src/core/game');
const example = require('./utils');


describe('New Game', () => {

    describe('Players Joining Game', () => {
        let eventsListener;
        let board;
        let addedPlayers;

        beforeEach((done) => {
            addedPlayers = [];
            eventsListener = example.emptyEventsListener();
            board = example.defaultBoard();

            eventsListener.onPlayerAdded = (player) => addedPlayers.push(player);

            done();
        })       

        it ('have userId', () => {
            const game = new Game({board, eventsListener});
            
            game.addPlayer(example.users.first);

            assert.equal(1, addedPlayers[0].userId);
        })

        it ('have username', () => {
            const game = new Game({board, eventsListener});
            
            game.addPlayer(example.users.first);

            assert.equal("A", addedPlayers[0].userName);
        })

        it ('have initial HP', () => {
            const game = new Game({board, eventsListener});
            
            game.addPlayer(example.users.first);

            assert.equal(100, addedPlayers[0].hp);
        })

        it ('have empty inventory', () => {
            game = new Game({board, eventsListener});
            
            game.addPlayer(example.users.first);

            assert.deepStrictEqual([], addedPlayers[0].inventory);
        })

        it ('have positions of starting points on the board', () => {
            board = [
                [Tail.startingPoint(), Tail.startingPoint()],
                [Tail.startingPoint()]
            ]
            const game = new Game({board, eventsListener});
            
            game.addPlayer(example.users.first);
            game.addPlayer(example.users.second);
            game.addPlayer(example.users.third);
        
            assert.deepEqual({row: 0, col: 0}, addedPlayers[0].position);
            assert.deepEqual({row: 0, col: 1}, addedPlayers[1].position);
            assert.deepEqual({row: 1, col: 0}, addedPlayers[2].position);                    
       })

       it ('are not be accepted if all starting points are taken', () => {
            const board = [[Tail.startingPoint()], [Tail.startingPoint()]]
            game = new Game({board, eventsListener});
           
            game.addPlayer(example.users.first);
            game.addPlayer(example.users.second)

            try {
                game.addPlayer(example.users.third);
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
    });

    describe('Leaving the game', () => {
        it ('should remove player from the list', () => {
            const board = example.defaultBoard();
            const eventsListener = example.emptyEventsListener(); 
        })
    })
});