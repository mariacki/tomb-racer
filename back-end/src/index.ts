import WebSocket from 'ws';
import { AppContext, WebSocketUserConnection } from './impl';
import { Server } from './server';
import { configure } from './game';
import { Channels } from './channel';

//set up web socket server
const webSocketServer = new WebSocket.Server({port: 8080});

const channels = new Channels();
const gameService = configure(new AppContext(channels))

channels.createChannel('lobby');

//message handling
const handler = Server.configure(gameService, channels);

webSocketServer.on("connection", (connection) => {
    const user = new WebSocketUserConnection(connection);

    connection.on('message', (data) => {
        const command = JSON.parse(data.toString());
        handler.handleMesage(user, command);
    })

    connection.on('close', () => {
        handler.connectionLost(user);
    })
})