class StartingPointTail {
    constructor(position) {
        this.position = position;
    }
}

const Tail = {
    startingPoint() {
        return (row, col) => {
            return new StartingPointTail({row, col});
        }
    }
}

class Board
{
    constructor(tails) {
        this.tails = [];
        this.startingPoints = [];
        this.currentStartingPointIndex = 0;
        
        for (let row = 0; row < tails.length; row++) {
            for (let col = 0; col < tails[row].length; col++) {
                this.tails[row] = [];
                this.tails[row][col] = tails[row][col](row,col);
                
                if (this.tails[row][col] instanceof StartingPointTail) {
                    this.startingPoints.push(this.tails[row][col]);
                }
            }
        }
    }

    nextStartingPoint() {
        return this.startingPoints[this.currentStartingPointIndex++];
    }
}


class Game
{
    constructor(ctx) {
        this.eventsListener = ctx.eventsListener;
        this.board = new Board(ctx.board);
        this.currentStartingPointIndex = 0;        
    }

    addPlayer(playerInfo) {
        this.eventsListener.onPlayerAdded({
            ...playerInfo, 
            hp: 100, 
            inventory: [],
            position: this.board.nextStartingPoint().position
        })
    }
}

module.exports = {
    Game,
    Tail
}