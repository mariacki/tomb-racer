"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../game");
const common_1 = require("../../../common");
const board_1 = __importDefault(require("./board"));
class Server {
    constructor(gameService, channelManager) {
        this.gameService = gameService;
        this.channelManager = channelManager;
    }
    static configure(gameService, channelManager) {
        return new Server(gameService, channelManager);
    }
    connectionLost(caller) {
        if (caller.gameId) {
            const playerData = new game_1.PlayerData(caller.gameId, caller.id, caller.userName);
            this.gameService.removePlayer(playerData);
            this.channelManager.removeUser(caller.gameId, caller.id);
            if (this.gameService.gameState(caller.gameId).players.length === 0) {
                this.gameService.removeGame(caller.gameId);
            }
        }
        if (caller.userName) {
            this.channelManager.removeUser("lobby", caller.id);
        }
    }
    handleMesage(caller, event) {
        try {
            console.log("Input", event);
            switch (event.type) {
                case common_1.CommandType.CREATE_GAME:
                    this.handleCreateGameCommand(caller, event);
                    break;
                case common_1.CommandType.JOIN_GAME:
                    this.hanleJoinGameCommand(caller, event);
                    break;
                case common_1.CommandType.LOGIN:
                    this.handleLoginCommand(caller, event);
                    break;
                case common_1.CommandType.START_GAME:
                    this.handleStartGameCommand(caller, event);
                    break;
                case common_1.CommandType.MOVE:
                    this.handleMoveCommand(caller, event);
                    break;
            }
        }
        catch (error) {
            caller.send(error);
        }
    }
    handleCreateGameCommand(caller, command) {
        const gameId = this.gameService.createGame(command, board_1.default());
        this.channelManager.createChannel(gameId);
    }
    hanleJoinGameCommand(caller, command) {
        this.addPlayerToTheGame(caller, command);
        this.sendGameStateToTheCaller(caller, command.gameId);
        caller.gameId = command.gameId;
        this.channelManager.addUserToChannel(command.gameId, caller);
    }
    addPlayerToTheGame(caller, command) {
        const playerData = new game_1.PlayerData(command.gameId, caller.id, caller.userName);
        this.gameService.addPlayer(playerData);
    }
    sendGameStateToTheCaller(caller, gameId) {
        const gameState = this.gameService.gameState(gameId);
        caller.send(this.gameStateEvent(gameState));
    }
    gameStateEvent(gameState) {
        return {
            type: common_1.EventType.GAME_JOINED,
            isError: false,
            currentState: gameState,
            origin: gameState.id
        };
    }
    handleLoginCommand(caller, command) {
        caller.userName = command.userName;
        const gameList = this.gameService.gameList();
        const event = {
            isError: false,
            origin: undefined,
            type: common_1.EventType.LOGIN_SUCCESS,
            games: gameList,
            userId: caller.id
        };
        caller.send(event);
        this.channelManager.addUserToChannel("lobby", caller);
    }
    handleStartGameCommand(caller, command) {
        const playerData = new game_1.PlayerData(caller.gameId, caller.id, caller.userName);
        this.gameService.startRequest(playerData);
    }
    handleMoveCommand(caller, command) {
        const movement = new game_1.Movement(caller.id, caller.gameId, command.path);
        this.gameService.executeMovement(movement);
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map