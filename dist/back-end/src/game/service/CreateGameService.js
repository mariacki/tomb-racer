"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const errors_1 = require("../errors");
const common_1 = require("../../../../common");
const events_1 = require("../events");
const RepositoryService_1 = require("./RepositoryService");
class CreateGameService extends RepositoryService_1.RepositoryService {
    constructor(gameRepository, idProvider, event) {
        super(gameRepository);
        this.idProvider = idProvider;
        this.event = event;
    }
    createGame(data, boardDefinition) {
        this.assertValidData(data);
        const game = new model_1.Game(this.idProvider.newId(), data.gameName, new model_1.Board(boardDefinition));
        super.persistGame(game);
        this.event.dispatch(new events_1.GameCreatedEvent(game));
        return game.id;
    }
    assertValidData(data) {
        console.log(this.gameRepository);
        if (data.gameName == "") {
            throw new errors_1.ValidationError(common_1.ErrorType.FIELD_REQUIRED, "gameName");
        }
        if (this.gameRepository.hasGameWithName(data.gameName)) {
            throw this.gameDuplicated(data.gameName);
        }
    }
    gameDuplicated(name) {
        return {
            isError: true,
            type: common_1.ErrorType.FIELD_NOT_UNIQUE,
            origin: undefined,
            message: "Game with this name already exists.",
            gameName: name
        };
    }
}
exports.CreateGameService = CreateGameService;
//# sourceMappingURL=CreateGameService.js.map