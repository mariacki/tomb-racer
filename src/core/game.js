/**
 * Player position on the board
 */
class Positon {

    /**
     * 
     * @param {Number} row 
     * @param {Number} col 
     */
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

class Tile
{
    constructor(position) {
        this.position = position;
    }

    /**
     * @returns {String}
     */
    getType() {
        throw "Not implemented by subclass";
    }
}

/**
 * Tail that players are placed at the beginning to the game.
 */
class StartingPointTail extends Tile {
    constructor(position) {
        super(position);
    }

    getType() {
        return "STARTING POINT"
    }
}

class WalkableTile extends Tile {
    getType() {
        return "WALKABLE"
    }
}

/**
 * Factory for game tails.
 */
const Tiles = {
    startingPoint() {
        return (row, col) => {
            return new StartingPointTail({row, col});
        }
    },

    walkable () {
        return (row, col) => {
            return new WalkableTile({row, col});
        }
    }
}

/**
 * Represents the board.
 */
class Board
{
    /**
     * 
     * @param {Array[][]} tails 
     */
    constructor(tails) {            
        this._createTails(tails);
        this._createStartingPoints();
    }

    /**
     * 
     * @param {Array} tailDefs 
     */
    _createTails(tailDefs) {
        this.currentStartingPointIndex = 0;
        this.tails = tailDefs.map(
            (rowDefs, rowNumber) => 
                rowDefs.map(
                    (createTail, columnNumber) => 
                        createTail(rowNumber, columnNumber)
                )
        )
    }

    _createStartingPoints() {
        this.startingPoints = [];
        const startingPoints = (tail) => tail instanceof StartingPointTail;
        const getStartingPoints = (tailRow) => this
            .startingPoints
            .push(...tailRow.filter(startingPoints));
        
        this.tails.map(getStartingPoints)
    }

    /**
     * @returns {Position}
     */
    nextStartingPosition() {
        const startingPoint = this.startingPoints[this.currentStartingPointIndex++];
        return startingPoint.position;
    }

    /**
     * @returns {Boolean}
     */
    hasNextStartingPoint() {
        return this.currentStartingPointIndex === this.startingPoints.length;
    }
}

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
    }
}

const GAME_STATE_NEW = 1;
const GAME_STATE_PLAYING = 2;

class Game
{
    constructor(ctx) {
        this.eventsListener = ctx.eventsListener;
        this.board = new Board(ctx.board);
        this.currentStartingPointIndex = 0;
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
            throw {
                type: "JOIN-ERROR",
                message: "Maximum number of players exceeded"
            }
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
        this._assertCurrentPlayer(userId, {
            type: 'INVALID-USER-FINISHING-TURN'
        });
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
        return this.players[this.currentPlayerIndex].userId;
    }

    movePlayer(userId, position) {
        if (this.gameState != GAME_STATE_PLAYING) {
            throw {
                type: "CANNOT-MOVE-PLAYER-GAME-NOT-STARTED"
            }
        }
        
        this._assertCurrentPlayer(userId, {
            type: "INVALID-USER-MOVING"
        });

        this.eventsListener.onPlayerMoved({
            userId,
            newPosition: position
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