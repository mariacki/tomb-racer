"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserNotFound_1 = __importDefault(require("../errors/UserNotFound"));
const GameStartedTwice_1 = __importDefault(require("../errors/GameStartedTwice"));
const GameStartedEvent_1 = __importDefault(require("../events/GameStartedEvent"));
const Turn_1 = __importDefault(require("./Turn"));
const GameNotStarted_1 = __importDefault(require("../errors/GameNotStarted"));
const IncorrectPlayerAction_1 = __importDefault(require("../errors/IncorrectPlayerAction"));
const PlayerMoved_1 = __importDefault(require("../events/PlayerMoved"));
const Tile_1 = require("./tile/Tile");
const NextTurn_1 = __importDefault(require("../events/NextTurn"));
const PlayerDied_1 = __importDefault(require("../events/PlayerDied"));
const GameFinished_1 = __importDefault(require("../events/GameFinished"));
var State;
(function (State) {
    State["WAITING_FOR_USERS"] = "WAITING FOR PLAYERS";
    State["STARTED"] = "STARTED";
    State["FINISHED"] = "FINISHED";
})(State || (State = {}));
class Game {
    constructor(id, name, board) {
        this.players = [];
        this.gameStartRequests = new Set();
        this.currentPlayerIdx = 0;
        this.id = id;
        this.name = name;
        this.board = board;
        this.state = State.WAITING_FOR_USERS;
    }
    addPlayer(player) {
        player.position = this.board.nextFreePosition();
        player.startedOn = player.position;
        this.players.push(player);
    }
    removePlayer(userId) {
        this.players = this.players.filter(this.doesNotHaveId(userId));
    }
    startRequest(userId, env) {
        this.assertPlayerExists(userId);
        if (this.gameStartRequests.has(userId)) {
            throw new GameStartedTwice_1.default(userId);
        }
        this.gameStartRequests.add(userId);
        if (this.shouldStart()) {
            this.start(env);
            env.eventDispatcher.dispatch(new GameStartedEvent_1.default(this.id, this.currentTurn));
        }
    }
    getState() {
        return {
            id: this.id,
            name: this.name,
            players: this.getPlayersState(),
            currentTurn: this.currentTurn ? this.currentTurn.state() : {},
            board: this.board.toTileList()
        };
    }
    getPlayersState() {
        const players = [];
        this.players.forEach(player => {
            players.push({
                userId: player.userId,
                userName: player.userName,
                hp: player.hp,
                position: {
                    row: player.position.row,
                    col: player.position.col
                }
            });
        });
        return players;
    }
    movment(movement, env) {
        this.assertGameStarted();
        this.assertCurrentTurn(movement);
        this.assertValidPath(movement.path);
        const lastPosition = movement.path[movement.path.length - 1];
        const player = this.getPlayer(movement.userId);
        this.board.getTilesOfPath(movement.path).forEach((tile) => {
            tile.onWalkThrough(player, this.board, env);
        });
        /**
         * That is exactly what happens when you are tired.
         */
        if (player.hp <= 0) {
            player.position = player.startedOn;
            player.hp = 100;
            env.eventDispatcher.dispatch(new PlayerDied_1.default(this.id, player));
        }
        else {
            player.position = lastPosition;
            env.eventDispatcher.dispatch(new PlayerMoved_1.default(this.id, player, movement.path));
            if (this.board.tiles[lastPosition.row][lastPosition.col].type == Tile_1.TileType.FINISH_POINT) {
                this.state = State.FINISHED;
                env.eventDispatcher.dispatch(new GameFinished_1.default(this.id, player));
                return;
            }
        }
        this.nextTurn(env.rnd);
        env.eventDispatcher.dispatch(new NextTurn_1.default(this.id, this.currentTurn));
    }
    nextTurn(rnd) {
        this.currentPlayerIdx++;
        this.currentTurn = new Turn_1.default(this.players[this.currentPlayerIdx].userId, rnd);
    }
    assertGameStarted() {
        if (this.state != State.STARTED) {
            throw new GameNotStarted_1.default(this.id);
        }
    }
    assertCurrentTurn(movement) {
        if (this.currentTurn.userId != movement.userId) {
            throw new IncorrectPlayerAction_1.default(this.id, this.currentTurn.userId, movement.userId);
        }
    }
    assertValidPath(path) {
        this.board.validatePath(path, this.players[this.currentPlayerIdx].position, this.currentTurn.stepPoints);
    }
    shouldStart() {
        return this.players.length == this.gameStartRequests.size;
    }
    start(env) {
        this.state = State.STARTED;
        this.currentTurn = new Turn_1.default(this.players[0].userId, env.rnd);
    }
    assertPlayerExists(userId) {
        if (!this.getPlayer(userId)) {
            throw new UserNotFound_1.default(userId);
        }
    }
    getPlayer(userId) {
        return this.players.filter(this.withUserId(userId))[0];
    }
    withUserId(userId) {
        return (player) => player.userId == userId;
    }
    doesNotHaveId(userId) {
        return (player) => player.userId !== userId;
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map