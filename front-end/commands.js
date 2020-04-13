const COMMAND_LOGIN = 'LOGIN';
const COMMAND_CREATE_GAME = 'CREATE-GAME';
const COMMAND_JOIN_GAME = 'JOIN-GAME';
const COMMAND_START_GAME = "START-GAME";

function login(connection, userName) {
    connection.send(JSON.stringify({
        type: COMMAND_LOGIN,
        data: {
            userName: userName
        }
    }))
}

function createGame(connection, gameName) {
    connection.send(JSON.stringify({
        type: COMMAND_CREATE_GAME,
        gameName
    }))
}

function joinGame(connection, gameId) {
    connection.send(JSON.stringify({
        type: COMMAND_JOIN_GAME,
        gameId
    }))
}

function startGame(connection) {
    connection.send(JSON.stringify({
        type: COMMAND_START_GAME
    }))
}

function movePlayer(connection, path) {
    connection.send(JSON.stringify({
        type: "MOVE-PLAYER",
        path
    }))
}

