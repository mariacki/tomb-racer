"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultGameService {
    constructor(gameListService, gameStateService, createGameService, addPlayerService, removePlayerService, startGameService, movementService, removeGameService) {
        this.gameListService = gameListService;
        this.gameStateService = gameStateService;
        this.createGameService = createGameService;
        this.addPlayerService = addPlayerService;
        this.removePlayerService = removePlayerService;
        this.startGameService = startGameService;
        this.movementService = movementService;
        this.removeGameService = removeGameService;
    }
    gameState(gameId) {
        return this.gameStateService.gameState(gameId);
    }
    gameList() {
        return this.gameListService.gameList();
    }
    createGame(data, board) {
        return this.createGameService.createGame(data, board);
    }
    addPlayer(addPlayerRequest) {
        this.addPlayerService.addPlayer(addPlayerRequest);
    }
    removePlayer(removePlayer) {
        this.removePlayerService.removePlayer(removePlayer);
    }
    startRequest(player) {
        this.startGameService.startRequest(player);
    }
    executeMovement(movement) {
        this.movementService.executeMovement(movement);
    }
    removeGame(gameId) {
        this.removeGameService.removeGame(gameId);
    }
}
exports.DefaultGameService = DefaultGameService;
//# sourceMappingURL=DefaultGameService.js.map