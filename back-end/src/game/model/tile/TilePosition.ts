import { Position } from 'tr-common';

export class TilePosition implements Position
{
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    static fromDto(data: Position): TilePosition {
        return new TilePosition(data.row, data.col);
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

    equals(other: Position)
    {
        return ( 
            (this.row === other.row) && 
            (this.col === other.col)
        );
    }

    
}