const {Tiles, Position} = require('./tiles');
const {Board} = require('./board');
const error = require('./error');

const GAME_STATE_NEW = 1;
const GAME_STATE_PLAYING = 2;

class Player
{
    /**
     * 
     * @param {Object} userInfo 
     * @param {Position} position 
     */
    constructor(userInfo, position) {
        this.userId = userInfo.userId;
        this.userName = userInfo.userName;
        this.hp = 100;
        this.position = position;
        this.inventory = [];
        this.walkPoints = 5;
    }

    /**
     * 
     * @param {Number} distanceTraveled 
     * @param {Position} position 
     */
    travel(distanceTraveled, position) {
        this.walkPoints -= distanceTraveled;
        this.position = position;
    }
}


class Game
{
    constructor(ctx) {
        this.eventsListener = ctx.eventsListener;
        this.board = new Board(ctx.board);   
        this.playerCount = 0;
        this.requestedStarts = 0;
        this.players = [];   
        this.currentPlayerIndex = 0;
        this.gameState = GAME_STATE_NEW;     
    }

    addPlayer(playerInfo) {
        this._assertEnoughSpace();

        const newPlayer = this._createPlayer(playerInfo)
        this.players.push(newPlayer);
        
        this.eventsListener.onPlayerAdded(newPlayer);

        this.playerCount++;
    }

    _assertEnoughSpace() {
        if (this.board.hasNextStartingPoint()) {
            throw error.joinError();
        }
    }

    _createPlayer(playerInfo) {
        return new Player(
            playerInfo,
            this.board.nextStartingPosition()
        );
    }

    requestStart() {
        this.requestedStarts++;

        if (this.requestedStarts === this.playerCount) {
            this.gameState = GAME_STATE_PLAYING;
            this.eventsListener.onGameStarted({
                type: "GAME-STARTED",
                currentTurn: this._currentTurn()
            })
        }
    }

    /**
     * 
     * @param {Number} userId 
     */
    finishTurn(userId) {
        this._assertCurrentPlayer(userId, error.invalidUserFinishinTrun());
        this.eventsListener.onTurnFinished(this._nextTurn());
    }

    _nextTurn() {
        this._nextPlayerTurn();
        return this._currentTurn();
    }

    _currentTurn() {
        return {
            userId: this._currentUserId()
        }
    }

    /**
     * 
     * @param    {Number} userId 
     */
    _assertCurrentPlayer(userId, exception) {
        if (!this._isCurrentPlayer(userId)) {
            throw exception;
        }
    }

    /**
     * @param {Number} userId
     * @returns {Boolean}
     */
    _isCurrentPlayer(userId) {
        return this._currentUserId() === userId;
    }

    _nextPlayerTurn() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex === this.players.length)
            this.currentPlayerIndex = 0;
    }

    /**
     * @returns {Number}
     */
    _currentUserId() {
        return this._currentPlayer().userId;
    }

    /**
     * @returns {Player}
     */
    _currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    movePlayer(userId, position) {
        if (this.gameState != GAME_STATE_PLAYING) {
            throw error.cannotMoveGameNotStarted();
        }

        this._assertCurrentPlayer(userId, error.invalidUserMoving())

        const player = this._currentPlayer();
        const newPosition = new Position(position.row, position.col);
        const path = this.board.shortestPath(player.position, newPosition);

        if (player.walkPoints < path.length) {
            throw error.moveExceedsDistance();
        }
        
        player.travel(path.length, newPosition);

        this.eventsListener.onPlayerMoved({
            userId,
            newPosition,
            walkPoints: player.walkPoints,
            path
        });
    }

    state() {
        return {
            players: this.players
        }
    }
}

module.exports = {
    Game,
    Tail: Tiles
}