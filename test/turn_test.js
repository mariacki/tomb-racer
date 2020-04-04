const assert = require('assert');
const {Game, Tail} = require('../src/core/game');
const example = require('./utils');

describe('Turns', () => {
    let eventsListener;

    beforeEach((done) => {
        turns = [];
        eventsListener = example.emptyEventsListener();
        done();
    })

    const createStartedGame = example.createStartedGame;
    
    describe('First turn in the game', () => {
        it ('should start immediately after game starts', () => {
            const expectedTurn = {userId: example.users.first.userId}
            let providedTurn;
            eventsListener.onGameStarted = (event) => providedTurn = event.currentTurn;
            const game = createStartedGame(eventsListener);
        
            assert.deepEqual(expectedTurn, providedTurn);
        })
    })

    describe('Fihishing a turn', () => {
        it ('can only be done by user whose turn is current', () => {
            const game = createStartedGame(eventsListener);

            try {
                game.finishTurn(example.users.second.userId);
                assert.fail();
            } catch(exception) {
                assert.equal("INVALID-USER-FINISHING-TURN", exception.type);
            }
        })

        it ('sets sets current for the user that jonied the game next', () => {
            const expecteTurn  = {userId: example.users.second.userId}
            let givenTurn; 
            eventsListener.onTurnFinished = (event) => givenTurn = event;
            const game = createStartedGame(eventsListener);

            game.finishTurn(example.users.first.userId);

            assert.deepEqual(expecteTurn, givenTurn);
        })

        it ('sets current turn for the first user if last user has finished', () => {
            const expecteTurn  = {userId: example.users.first.userId}
            let givenTurn; 
            eventsListener.onTurnFinished = (event) => givenTurn = event;
            const game = createStartedGame(eventsListener);

            game.finishTurn(example.users.first.userId);
            game.finishTurn(example.users.second.userId);

            assert.deepEqual(expecteTurn, givenTurn);
        })
    })
})