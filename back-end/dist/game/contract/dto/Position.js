"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Position {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    isAdjacentTo(other) {
        return ((this.row == other.row && this.col != other.col) ||
            (this.row != other.row && this.col == other.col)) && ((Math.abs(this.row - other.row) <= 1) &&
            (Math.abs(this.col - other.col) <= 1));
    }
    toString() {
        return `(${this.row}, ${this.col})`;
    }
}
exports.default = Position;
//# sourceMappingURL=Position.js.map