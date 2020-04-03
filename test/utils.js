const {Tail, Game} = require('./../src/game');

const emptyEventsListener = () => {
    return {
        onPlayerAdded() {},
        onGameStarted() {}, 
        onTurnFinished() {}
    }
}

const defaultBoard = () => {
    return [[Tail.startingPoint()]];
}

const users = {
    first: {
        userId: 1,
        userName: "A"
    }, 
    second: {
        userId: 2, 
        userName: 'B'
    },
    third: {
        userId: 3, 
        userName: 'C'
    }
}

const createStartedGame = (eventsListener) => {
    const board = [[Tail.startingPoint(), Tail.startingPoint()]];
    const game = new Game({board, eventsListener});

    game.addPlayer(users.first);
    game.addPlayer(users.second);
    game.requestStart();
    game.requestStart();

    return game;
}

module.exports = {
    emptyEventsListener,
    defaultBoard, 
    users,
    createStartedGame
}