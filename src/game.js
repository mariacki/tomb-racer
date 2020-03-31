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

/**
 * Tail that players are placed at the beginning to the game.
 */
class StartingPointTail {
    /**
     * 
     * @param {Position} position 
     */
    constructor(position) {
        this.position = position;
    }
}

/**
 * Factory for game tails.
 */
const Tail = {
    startingPoint() {
        return (row, col) => {
            return new StartingPointTail({row, col});
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

class Game
{
    constructor(ctx) {
        this.eventsListener = ctx.eventsListener;
        this.board = new Board(ctx.board);
        this.currentStartingPointIndex = 0;
        this.playerCount = 0;
        this.requestedStarts = 0;
        this.players = [];        
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
            this.eventsListener.onGameStarted({
                type: "GAME-STARTED"
            })
        }
    }

    state() {
        return {
            players: this.players
        }
    }
}

module.exports = {
    Game,
    Tail
}