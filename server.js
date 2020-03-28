const http = require('http');
const websocket = require('ws');
const httpHandler = require('./src/http_handler')
const wsHandler = require("./src/web_socket_handler");

const server = http.createServer(httpHandler.handleHTTPRequest);

const webSocketServer = new websocket.Server({
    server
});

const webSocketHandler = new wsHandler.WebSocketHandler();


webSocketServer.on('connection', (ws) => {
    webSocketHandler.handleConnection(ws);
})

server.listen(8000);