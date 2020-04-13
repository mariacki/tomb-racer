"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const impl_1 = __importDefault(require("./impl"));
const uuid_1 = __importDefault(require("uuid"));
const game_1 = require("./game");
const dto_1 = require("./game/contract/dto");
const board = [
    [game_1.Tiles.startingPoint(), game_1.Tiles.startingPoint(), game_1.Tiles.startingPoint()],
    [game_1.Tiles.path(), game_1.Tiles.spikes(), game_1.Tiles.path()],
    [game_1.Tiles.wall(), game_1.Tiles.path(), game_1.Tiles.wall()],
    [game_1.Tiles.path(), game_1.Tiles.path(), game_1.Tiles.path()],
    [game_1.Tiles.path(), game_1.Tiles.finishPoint(), game_1.Tiles.path()]
];
const channels = new Map();
channels.set("lounge", []);
const gameService = game_1.configure(new impl_1.default(channels));
const socketServer = new ws_1.default.Server({ port: 8080 });
console.log("Starting server");
socketServer.on('connection', (socket) => {
    const user = {
        userId: uuid_1.default.v4(),
        userName: "",
        gameId: "",
        socket
    };
    console.log(user.userId);
    socket.on('message', (data) => {
        console.log("Message from " + user.userId);
        const command = JSON.parse(data.toString());
        console.log(command);
        switch (command.type) {
            case "LOGIN":
                login(command, user);
                break;
            case "CREATE-GAME":
                createGame(command, user);
                break;
            case "JOIN-GAME":
                joinGame(command, user);
                break;
            case "START-GAME":
                startGame(command, user);
                break;
            case "MOVE-PLAYER":
                move(command, user);
                break;
        }
    });
});
function login(command, user) {
    user.userName = command.data.userName;
    channels.get("lounge").push(user.socket);
    user.socket.send(JSON.stringify({
        type: "LOGIN-SUCCESS",
        userId: user.userId,
        games: gameService.gameList().games
    }));
}
function createGame(command, user) {
    try {
        const gameDef = new dto_1.CreateGame(command.gameName);
        gameService.createGame(gameDef, board);
    }
    catch (error) {
        user.socket.send(JSON.stringify(error));
    }
}
function joinGame(command, user) {
    try {
        const userDef = new dto_1.PlayerData(command.gameId, user.userId, user.userName);
        user.gameId = command.gameId;
        channels.get(user.gameId).push(user.socket);
        gameService.addPlayer(userDef);
        const gameState = gameService.gameState(command.gameId);
        user.socket.send(JSON.stringify({
            type: "GAME-JOINED",
            game: gameState
        }));
    }
    catch (error) {
        user.socket.send(JSON.stringify(error));
    }
}
function startGame(command, user) {
    try {
        const userDef = new dto_1.PlayerData(user.gameId, user.userId, user.userName);
        gameService.startRequest(userDef);
    }
    catch (error) {
        user.socket.send(JSON.stringify(error));
    }
}
function move(command, user) {
    try {
        const move = new dto_1.Movement(user.userId, user.gameId, command.path.map((pos) => new dto_1.Position(pos.row, pos.col)));
        gameService.executeMovement(move);
        console.log(move);
    }
    catch (error) {
        user.socket.send(JSON.stringify(error));
    }
}
//# sourceMappingURL=index.js.map