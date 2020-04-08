const http = require('http');
const websocket = require('ws');
const httpHandler = require('./src/http_handler')
const wsHandler = require("./src/web_socket_handler");
const {Tiles} = require('./src/core/tiles');

const server = http.createServer(httpHandler.handleHTTPRequest);

const webSocketServer = new websocket.Server({
    server
});



const board = [
    [Tiles.startingPoint(), Tiles.walkable(), Tiles.walkable()],
    [Tiles.walkable(),      Tiles.walkable(), Tiles.walkable()],
    [Tiles.startingPoint(), Tiles.wall(),     Tiles.walkable()],
    [Tiles.walkable(),      Tiles.wall(),     Tiles.walkable()]
]

const webSocketHandler = new wsHandler.WebSocketHandler(board);

webSocketServer.on('connection', (ws) => {
    webSocketHandler.handleConnection(ws);
})

server.listen(8000);