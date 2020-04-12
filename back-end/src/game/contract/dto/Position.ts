export default class Position
{
    row: number;
    col: number;

    constructor(row: number, col: number) 
    {
        this.row = row;
        this.col = col;
    }

    isAdjacentTo(other: Position): boolean {
        return (
                (this.row == other.row && this.col != other.col) ||
                (this.row != other.row && this.col == other.col) 
            ) && (
                (Math.abs(this.row - other.row) <= 1) &&
                (Math.abs(this.col - other.col) <= 1) 
            )
    }

    toString(): string {
        return `(${this.row}, ${this.col})`
    }
}