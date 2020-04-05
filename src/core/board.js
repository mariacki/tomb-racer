const {Position, TileType} = require('./tiles');

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
        const startingPoints = (tail) => tail.getType() === TileType.STARTING_POINT;
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

    /**
     * 
     * @param {Position} positionA 
     * @param {Position} positionB 
     */
    shortestPath(positionA, positionB) {
        const positionsToCheck = [];
        const prev = [];
        const visitedPositions = [];

        positionsToCheck.push(positionA);

        let idx = 0;
        
        while (idx < positionsToCheck.length) {
            
            const currPos = positionsToCheck[idx++];

            //console.log("Visiting position: ", currPos);

            
            visitedPositions[currPos.toKey()] = true;

            const left = new Position(currPos.row, currPos.col - 1);
            const right = new Position(currPos.row, currPos.col + 1);
            const up = new Position(currPos.row - 1, currPos.col);
            const down = new Position(currPos.row + 1, currPos.col);

            let found = false;

            for (const position of [left, right, up, down]) {                
                if (!this.isValidPosition(position)) {
                    //console.log('Invalid position: ', position);
                    continue;
                }

                if (!visitedPositions[position.toKey()]) {
                    console.log("Position", currPos, "Is parent of ", position);
                    prev[position.toKey()] = currPos;

                    if (position.equals(positionB)) {
                        found = true;
                        break;
                    }
                    
                    positionsToCheck.push(position)
                }
            }

            if (found) { break; }
        }

        console.log(prev);

        const path = [];
        let pathElement = positionB;

        while (pathElement != positionA) {
            path.push(pathElement);
            
            pathElement = prev[pathElement.toKey()];
        }

        return path.reverse();
    }

    isValidPosition(position) {
        if (position.row < 0) {
            return false;
        }

        if (position.row >= this.tails.length) {
            return false;
        }

        const width = this.tails[position.row].length;
        if (position.col < 0) {
            return false;
        }

        if (position.col >= width) {
            return false;
        }

        if (!this.tailAtPosition(position).isWalkable()) {
            return false;
        }

        return true;
    }

    /**
     * 
     * @param {Position} position
     * @returns {Tile} 
     */
    tailAtPosition(position) {
        return this.tails[position.row][position.col];
    }

}

module.exports = {
    Board
}