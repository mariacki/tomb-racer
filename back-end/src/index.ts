import WebSocket from 'ws';
import WebSocketContext from './impl';
import uuid from 'uuid';
import { Tiles, configure } from './game';
import { CreateGame, PlayerData, Movement, Position } from './game/contract/dto';
import CannotStartGame from './game/errors/CannotStartGame';



const board = [
    [Tiles.startingPoint(), Tiles.startingPoint(), Tiles.startingPoint()],
    [Tiles.path(),          Tiles.spikes(),        Tiles.path()],
    [Tiles.wall(),          Tiles.path(),          Tiles.wall()],
    [Tiles.path(),          Tiles.path(),          Tiles.path()],
    [Tiles.path(),          Tiles.finishPoint(),   Tiles.path()]
]

const channels: Map<String, WebSocket[]> = new Map();

channels.set("lounge", []);

const gameService = configure(new WebSocketContext(channels))
const socketServer = new WebSocket.Server({port: 8080});

console.log("Starting server");

interface User {
    userId: string, 
    userName: string,
    socket: WebSocket
    gameId: string
}

socketServer.on('connection', (socket) => {
    const user = {
        userId: uuid.v4(),
        userName: "",
        gameId: "",
        socket
    }

    console.log(user.userId);

    socket.on('message', (data) => {
        console.log("Message from " + user.userId);
        const command = JSON.parse(data.toString());
        console.log(command); 

        switch (command.type) {
            case "LOGIN":  login(command, user); break;
            case "CREATE-GAME": createGame(command, user); break;
            case "JOIN-GAME": joinGame(command, user); break;
            case "START-GAME": startGame(command, user); break;
            case "MOVE-PLAYER": move(command, user); break;
        }
    })    
})



function login(command: any, user: User) {
    user.userName = command.data.userName;
    channels.get("lounge").push(user.socket);
    user.socket.send(JSON.stringify({
        type: "LOGIN-SUCCESS",
        userId: user.userId,
        games: gameService.gameList().games
    }))
}

function createGame(command: any, user: User) {
    try {
        const gameDef = new CreateGame(command.gameName);
        gameService.createGame(gameDef, board);
    } catch (error) {
        user.socket.send(JSON.stringify(error));
    }
}

function joinGame(command: any, user: User) {
    try {
        const userDef = new PlayerData(
            command.gameId,
            user.userId,
            user.userName
        )
        user.gameId = command.gameId;
        channels.get(user.gameId).push(user.socket)
        gameService.addPlayer(userDef);
        const gameState = gameService.gameState(command.gameId);

        user.socket.send(JSON.stringify({
            type: "GAME-JOINED",
            game: gameState
        }));
    } catch (error) {
        user.socket.send(JSON.stringify(error));
    }
}

function startGame(command: any, user: User) {
    try {
        const userDef = new PlayerData(
            user.gameId,
            user.userId,
            user.userName
        )
        gameService.startRequest(userDef)
    } catch (error) {
        user.socket.send(JSON.stringify(error));
    }
}

function move(command: any, user: User) {
    try {
        const move = new Movement(
            user.userId,
            user.gameId,
            command.path.map((pos: { row: number; col: number; }) => new Position(pos.row, pos.col))
        )
        gameService.executeMovement(move);
        console.log(move);
    } catch (error) {
        user.socket.send(JSON.stringify(error));
    }
}