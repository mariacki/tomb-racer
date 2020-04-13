"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const impl_1 = __importDefault(require("./impl"));
const uuid_1 = __importDefault(require("uuid"));
const game_1 = require("./game");
const board = [
    [game_1.Tiles.startingPoint(), game_1.Tiles.startingPoint(), game_1.Tiles.startingPoint()],
    [game_1.Tiles.path(), game_1.Tiles.spikes(), game_1.Tiles.path()],
    [game_1.Tiles.wall(), game_1.Tiles.path(), game_1.Tiles.wall()],
    [game_1.Tiles.path(), game_1.Tiles.path(), game_1.Tiles.path()],
    [game_1.Tiles.path(), game_1.Tiles.finishPoint(), game_1.Tiles.path()]
];
const channels = new Map();
const gameService = game_1.configure(new impl_1.default(channels));
const socketServer = new ws_1.default.Server({ port: 8080 });
console.log("Starting server");
socketServer.on('connection', (ws) => {
    const userId = uuid_1.default.v4();
    console.log("User " + userId);
    ws.on('message', (message) => {
        console.log(message);
    });
    ws.onerror = (event) => {
        console.log(event);
    };
});
//# sourceMappingURL=index.js.map