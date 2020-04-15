"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const tr_common_1 = require("tr-common");
const model_1 = require("../model");
const events_1 = require("../events");
const CannotStartGame_1 = __importDefault(require("../errors/CannotStartGame"));
class DefaultGameService {
    constructor(context) {
        this.context = context;
        this.gameRepository = context.repository;
        this.idProvider = context.idProvider;
        this.eventDispatcher = context.eventDispatcher;
    }
    gameState(gameId) {
        return this.gameRepository.findById(gameId).getState();
    }
    gameList() {
        return {
            games: this.gameRepository.findAll().map(game => {
                return {
                    gameId: game.id,
                    gameName: game.name
                };
            })
        };
    }
    createGame(data, board) {
        if (data.gameName == "") {
            throw new errors_1.ValidationError(tr_common_1.ErrorType.FIELD_REQUIRED, "gameName");
        }
        if (this.gameRepository.hasGameWithName(data.gameName)) {
            throw this.gameDuplicated(data.gameName);
        }
        const newGame = new model_1.Game(this.idProvider.newId(), data.gameName, new model_1.Board(board));
        this.gameRepository.add(newGame);
        this.eventDispatcher.dispatch(new events_1.GameCreatedEvent(newGame));
    }
    gameDuplicated(name) {
        return {
            isError: true,
            type: tr_common_1.ErrorType.FIELD_NOT_UNIQUE,
            origin: undefined,
            message: "Game with this name already exists.",
            gameName: name
        };
    }
    addPlayer(addPlayerRequest) {
        const game = this.gameRepository.findById(addPlayerRequest.gameId);
        if (!game) {
            throw new errors_1.GameNotFound(addPlayerRequest.gameId);
        }
        const player = new model_1.Player(addPlayerRequest.userId, addPlayerRequest.userName);
        game.addPlayer(player);
        this.gameRepository.persist(game);
        this.eventDispatcher.dispatch(new events_1.PlayerJoinedEvent(game.id, player));
    }
    removePlayer(removePlayer) {
        const game = this.gameRepository.findById(removePlayer.gameId);
        if (!game) {
            throw new errors_1.GameNotFound(removePlayer.gameId);
        }
        game.removePlayer(removePlayer.userId);
        this.gameRepository.persist(game);
        this.eventDispatcher.dispatch(new events_1.PlayerLeftEvent(removePlayer.userId, game.id));
    }
    startRequest(player) {
        try {
            const game = this.getGame(player.gameId);
            game.startRequest(player.userId, this.context);
            this.gameRepository.persist(game);
        }
        catch (gameError) {
            throw new CannotStartGame_1.default(gameError);
        }
    }
    executeMovement(movement) {
        const game = this.getGame(movement.gameId);
        game.movment(movement, this.context);
        this.gameRepository.persist(game);
    }
    getGame(gameId) {
        const game = this.gameRepository.findById(gameId);
        if (!game) {
            throw new errors_1.GameNotFound(gameId);
        }
        return game;
    }
}
exports.DefaultGameService = DefaultGameService;
//# sourceMappingURL=DefaultGameService.js.map