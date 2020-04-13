"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameInMemoryRepository {
    constructor() {
        this.games = [];
    }
    hasGameWithName(gameName) {
        const gamesWithName = this.games.filter(this.byName(gameName));
        return gamesWithName.length > 0;
    }
    add(game) {
        this.games.push(game);
    }
    findById(gameId) {
        return this.games.filter(this.byId(gameId))[0];
    }
    persist(game) {
    }
    findAll() {
        return this.games;
    }
    byName(name) {
        return (game) => { return game.name == name; };
    }
    byId(gameId) {
        return (game) => {
            return game.id == gameId;
        };
    }
}
exports.GameInMemoryRepository = GameInMemoryRepository;
//# sourceMappingURL=GameInMemoryRepository.js.map