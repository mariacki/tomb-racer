"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultGameService_1 = require("./service/DefaultGameService");
const GameListService_1 = require("./service/GameListService");
const GameStateService_1 = require("./service/GameStateService");
const CreateGameService_1 = require("./service/CreateGameService");
const AddPlayerService_1 = require("./service/AddPlayerService");
const RemovePlayer_1 = require("./service/RemovePlayer");
const StartGameService_1 = require("./service/StartGameService");
const MovementService_1 = require("./service/MovementService");
const RemoveGameService_1 = require("./service/RemoveGameService");
__export(require("./contract"));
__export(require("./model/tile"));
exports.configure = (ctx) => {
    return new DefaultGameService_1.DefaultGameService(new GameListService_1.GameListService(ctx.repository), new GameStateService_1.GameStateService(ctx.repository), new CreateGameService_1.CreateGameService(ctx.repository, ctx.idProvider, ctx.eventDispatcher), new AddPlayerService_1.AddPlayerService(ctx.repository, ctx.eventDispatcher), new RemovePlayer_1.RemovePlayerService(ctx.repository, ctx.eventDispatcher), new StartGameService_1.StartGameService(ctx.repository, ctx.eventDispatcher, ctx.rnd), new MovementService_1.MovementService(ctx.repository, ctx), new RemoveGameService_1.RemoveGameService(ctx.repository, ctx.eventDispatcher));
};
//# sourceMappingURL=index.js.map