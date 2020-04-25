"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameInMemoryRepository_1 = require("../../../src/repository/GameInMemoryRepository");
class GameRepositorySpy extends GameInMemoryRepository_1.GameInMemoryRepository {
    constructor() {
        super(...arguments);
        this.persistedGames = [];
        this.addedGames = [];
    }
    persist(game) {
        super.persist(game);
        this.persistedGames.push(game);
        this.addedGames.push(game);
        this.lastPersistedGame = game;
    }
}
exports.GameRepositorySpy = GameRepositorySpy;
//# sourceMappingURL=GameRepositorySpy.js.map