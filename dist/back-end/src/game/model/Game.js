"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const errors_1 = require("../errors");
const events_1 = require("../events");
const common_1 = require("../../../../common");
const PlayerFactory_1 = require("./PlayerFactory");
const Path_1 = require("./Path");
const PlayerCollection_1 = require("./PlayerCollection");
var State;
(function (State) {
    State["WAITING_FOR_USERS"] = "WAITING FOR PLAYERS";
    State["STARTED"] = "STARTED";
    State["FINISHED"] = "FINISHED";
})(State || (State = {}));
class Game {
    constructor(id, name, board) {
        this.players = new PlayerCollection_1.PlayerCollection();
        this.gameStartRequests = new Set();
        this.currentPlayerIdx = -1;
        this.id = id;
        this.name = name;
        this.board = board;
        this.state = State.WAITING_FOR_USERS;
    }
    addPlayer(playerData) {
        this.assertStartingPointsLeft();
        const playerPosition = this.board.reserveStartingPoint();
        const player = PlayerFactory_1.PlayerFactory.create(playerData, playerPosition);
        this.players.push(player);
        return [new events_1.PlayerJoinedEvent(this.id, player)];
    }
    assertStartingPointsLeft() {
        if (!this.board.hasFreeStartingPoints()) {
            throw new errors_1.NumberOfStartingPointsExceeded(this.board.numberOfStartingPoints(), this.id);
        }
    }
    removePlayer(userId) {
        const removedPlayer = this.players.getByUserId(userId);
        this.players.removeHavingId(userId);
        this.board.freeStartingPoint(removedPlayer.startedOn);
        return [new events_1.PlayerLeftEvent(userId, this.id)];
    }
    addStartRequest(userId) {
        this.assertPlayerExists(userId);
        this.assertNoStartRequestFrom(userId);
        this.gameStartRequests.add(userId);
    }
    isReadyToStart() {
        if (this.state === State.STARTED)
            return;
        return this.gameStartRequests.size === this.players.size();
    }
    start(diceRoll) {
        this.state = State.STARTED;
        return this.startNextTurn(diceRoll);
    }
    startNextTurn(diceRoll) {
        const player = this.nextPlayer();
        this.currentTurn = new _1.GameTurn(player.userId, diceRoll);
        return [new events_1.TurnStartedEvent(this.id, this.currentTurn)];
    }
    nextPlayer() {
        const shouldRewind = ++this.currentPlayerIdx == this.players.size();
        this.currentPlayerIdx = shouldRewind ? 0 : this.currentPlayerIdx;
        return this.players.getByIndex(this.currentPlayerIdx);
    }
    assertNoStartRequestFrom(userId) {
        if (this.gameStartRequests.has(userId)) {
            throw new errors_1.GameStartedTwice(userId, this.id);
        }
    }
    getState() {
        return {
            id: this.id,
            name: this.name,
            players: this.players.getAll(),
            currentTurn: this.currentTurn ? this.currentTurn : {},
            board: this.board.toTileList()
        };
    }
    executeMovement(movement, env) {
        this.assertGameStarted();
        this.assertCurrentTurn(movement);
        const events = [];
        const player = this.players.getByUserId(movement.userId);
        const length = this.currentTurn.stepPoints;
        const path = new Path_1.Path(movement.path, this.board, length);
        events.push(...path.executeWalk(player, this));
        if (player.hadDied()) {
            player.restore();
            return [...events, new events_1.PlayerDiedEvent(this.id, player)];
        }
        events.push(new events_1.PlayerMovedEvent(this.id, player.userId, movement.path));
        return events;
    }
    canBeFinished() {
        const lastPlayerPosition = this.players.getByIndex(this.currentPlayerIdx).position;
        const tile = this.board.getTile(lastPlayerPosition);
        return tile.type === common_1.TileType.FINISH_POINT;
    }
    finish() {
        this.state = State.FINISHED;
        const winner = this.players.getByIndex(this.currentPlayerIdx);
        return [new events_1.GameFinishedEvent(this.id, winner.userId)];
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
    assertPlayerExists(userId) {
        if (!this.players.has(userId)) {
            throw new errors_1.UserNotFound(userId);
        }
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map