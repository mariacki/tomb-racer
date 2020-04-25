"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../src/game");
const GameRepositorySpy_1 = require("./spy/GameRepositorySpy");
const IdProviderMock_1 = require("./mock/IdProviderMock");
const EventDispatcherMock_1 = require("./mock/EventDispatcherMock");
const contract_1 = require("../../src/game/contract");
const tile_1 = require("../../src/game/model/tile");
exports.UserExample = {
    first: new contract_1.PlayerData("id1", "user-id-1", "username-1"),
    second: new contract_1.PlayerData("id1", "user-id-2", "username-2"),
    third: new contract_1.PlayerData("id1", "user-id-3", "username-3"),
    invalidGameId: new contract_1.PlayerData("non-existing", "user-id-invalid", "username-invalid")
};
class GameTestContext {
    constructor() {
        this.randomResult = 0;
        this.randomizer = (start, end) => {
            return this.randomResult;
        };
    }
    initializer() {
        return (done) => {
            this.gameRepositorySpy = new GameRepositorySpy_1.GameRepositorySpy();
            this.idProvider = new IdProviderMock_1.IdProviderMock();
            this.eventDispatcher = new EventDispatcherMock_1.EventDispatcherMock();
            const context = new contract_1.Context(this.eventDispatcher, this.idProvider, this.gameRepositorySpy, this.randomizer);
            this.gameService = game_1.configure(context);
            done();
        };
    }
    startGame(board = this.defaultBoard()) {
        const gameDef = new contract_1.CreateGame("Some Game");
        this.gameService.createGame(gameDef, board);
        this.gameService.addPlayer(exports.UserExample.first);
        this.gameService.addPlayer(exports.UserExample.second);
        this.gameService.addPlayer(exports.UserExample.third);
        this.gameService.startRequest(exports.UserExample.first);
        this.gameService.startRequest(exports.UserExample.second);
        this.gameService.startRequest(exports.UserExample.third);
    }
    defaultBoard() {
        return [[tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint(), tile_1.Tiles.startingPoint()]];
    }
}
exports.GameTestContext = GameTestContext;
//# sourceMappingURL=GameTestContext.js.map