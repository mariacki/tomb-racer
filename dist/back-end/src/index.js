"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const impl_1 = require("./impl");
const server_1 = require("./server");
const game_1 = require("./game");
const channel_1 = require("./channel");
//set up web socket server
const webSocketServer = new ws_1.default.Server({ port: 8080 });
const channels = new channel_1.Channels();
const gameService = game_1.configure(new impl_1.AppContext(channels));
channels.createChannel('lobby');
//message handling
const handler = server_1.Server.configure(gameService, channels);
webSocketServer.on("connection", (connection) => {
    const user = new impl_1.WebSocketUserConnection(connection);
    connection.on('message', (data) => {
        const command = JSON.parse(data.toString());
        handler.handleMesage(user, command);
    });
    connection.on('close', () => {
        handler.connectionLost(user);
    });
});
//# sourceMappingURL=index.js.map