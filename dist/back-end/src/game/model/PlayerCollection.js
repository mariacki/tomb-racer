"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerCollection {
    constructor() {
        this.players = [];
        this.playersById = new Map();
    }
    push(player) {
        const index = this.players.push(player) - 1;
        this.playersById.set(player.userId, { index, player });
    }
    removeHavingId(userId) {
        const playerItem = this.playersById.get(userId);
        this.playersById.delete(userId);
        this.players.splice(playerItem.index, 1);
    }
    getByUserId(userId) {
        return this.playersById.get(userId).player;
    }
    getByIndex(index) {
        return this.players[index];
    }
    size() {
        return this.players.length;
    }
    getAll() {
        return this.players;
    }
    has(userId) {
        return this.playersById.has(userId);
    }
}
exports.PlayerCollection = PlayerCollection;
//# sourceMappingURL=PlayerCollection.js.map