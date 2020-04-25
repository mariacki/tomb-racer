"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameServiceSpy {
    constructor() {
        this.gameStateExample = {
            id: "some-game-id",
            name: "some-game-name",
            players: [],
            currentTurn: {},
            board: []
        };
        this.gameListExample = [{
                id: "some-game-id",
                name: "some-game-name"
            }];
        this.createdGames = [];
        this.addedPlayers = [];
        this.startRequests = [];
        this.movedPlayers = [];
        this.removedPlayers = [];
        this.removedGames = [];
    }
    createGame(data, board) {
        this.createdGames.push(data);
        return this.newGameId;
    }
    addPlayer(player) {
        this.addedPlayers.push(player);
    }
    removePlayer(player) {
        this.removedPlayers.push(player);
    }
    startRequest(player) {
        this.startRequests.push(player);
    }
    executeMovement(movement) {
        this.movedPlayers.push(movement);
    }
    gameState(gameId) {
        return this.gameStateExample;
    }
    gameList() {
        return this.gameListExample;
    }
    removeGame(gameId) {
        this.removedGames.push(gameId);
    }
}
exports.GameServiceSpy = GameServiceSpy;
//# sourceMappingURL=GameServiceSpy.js.map