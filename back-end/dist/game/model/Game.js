"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const errors_1 = require("../errors");
const events_1 = require("../events");
const tr_common_1 = require("tr-common");
const tile_1 = require("./tile");
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
        if (!this.board.hasFreePositions()) {
            throw new errors_1.NumberOfStartingPointsExceeded(this.board.startingPoints.length, this.id);
        }
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
            throw new errors_1.GameStartedTwice(userId, this.id);
        }
        this.gameStartRequests.add(userId);
        if (this.shouldStart()) {
            this.start(env);
            env.eventDispatcher.dispatch(new events_1.TurnStartedEvent(this.id, this.currentTurn));
        }
    }
    getState() {
        return Object.assign(Object.assign({}, this), { board: this.board.tiles });
    }
    movment(movement, env) {
        this.assertGameStarted();
        this.assertCurrentTurn(movement);
        const path = movement.path.map(position => tile_1.TilePosition.fromDto(position));
        this.assertValidPath(path);
        const lastPosition = path[movement.path.length - 1];
        const player = this.getPlayer(movement.userId);
        this.board.getTilesOfPath(movement.path).forEach((tile) => {
            tile.onWalkThrough(player, env, this);
        });
        if (player.hp <= 0) {
            player.position = player.startedOn;
            player.hp = 100;
            env.eventDispatcher.dispatch(new events_1.PlayerDiedEvent(this.id, player));
        }
        else {
            player.position = lastPosition;
            env.eventDispatcher.dispatch(new events_1.PlayerMovedEvent(this.id, player.userId, movement.path));
            if (this.board.tiles[lastPosition.row][lastPosition.col].type == tr_common_1.TileType.FINISH_POINT) {
                this.state = State.FINISHED;
                env.eventDispatcher.dispatch(new events_1.GameFinishedEvent(this.id, player.userId));
                return;
            }
        }
        this.nextTurn(env.rnd);
        env.eventDispatcher.dispatch(new events_1.TurnStartedEvent(this.id, this.currentTurn));
    }
    nextTurn(rnd) {
        this.currentPlayerIdx++;
        if (this.currentPlayerIdx == this.players.length) {
            this.currentPlayerIdx = 0;
        }
        this.currentTurn = new _1.GameTurn(this.players[this.currentPlayerIdx].userId, rnd);
    }
    assertGameStarted() {
        if (this.state != State.STARTED) {
            throw new errors_1.GameNotStarted(this.id);
        }
    }
    assertCurrentTurn(movement) {
        if (this.currentTurn.currentlyPlaying != movement.userId) {
            throw new errors_1.IncorrectPlayerAction(this.id, movement.userId, this.currentTurn.currentlyPlaying);
        }
    }
    assertValidPath(path) {
        const result = this.board.validatePath(path, this.players[this.currentPlayerIdx].position, this.currentTurn.stepPoints);
        if (!result.isValid) {
            throw new errors_1.InvalidPath(this.id, result.invalidPath, result.message);
        }
    }
    shouldStart() {
        return this.players.length == this.gameStartRequests.size;
    }
    start(env) {
        this.state = State.STARTED;
        this.currentTurn = new _1.GameTurn(this.players[0].userId, env.rnd);
    }
    assertPlayerExists(userId) {
        if (!this.getPlayer(userId)) {
            throw new errors_1.UserNotFound(userId);
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
exports.Game = Game;
//# sourceMappingURL=Game.js.map