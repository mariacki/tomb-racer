"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TilePosition {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    static fromDto(data) {
        return new TilePosition(data.row, data.col);
    }
    isAdjacentTo(other) {
        return ((this.row == other.row && this.col != other.col) ||
            (this.row != other.row && this.col == other.col)) && ((Math.abs(this.row - other.row) <= 1) &&
            (Math.abs(this.col - other.col) <= 1));
    }
    equals(other) {
        return ((this.row === other.row) &&
            (this.col === other.col));
    }
}
exports.TilePosition = TilePosition;
//# sourceMappingURL=TilePosition.js.map