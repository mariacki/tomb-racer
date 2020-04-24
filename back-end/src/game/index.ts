import { Context } from './contract';
import { DefaultGameService } from './service/DefaultGameService';
import { GameListService } from './service/GameListService';
import { GameStateService } from './service/GameStateService';
import { CreateGameService } from './service/CreateGameService';
import { AddPlayerService } from './service/AddPlayerService';
import { RemovePlayerService } from './service/RemovePlayer';
import { StartGameService } from './service/StartGameService';
import { MovementService } from './service/MovementService';
import { RemoveGameService } from './service/RemoveGameService';


export * from './contract';
export * from './model/tile';

export const configure = (
    ctx: Context
) => {
    return new DefaultGameService(
        new GameListService(ctx.repository),
        new GameStateService(ctx.repository),
        new CreateGameService(ctx.repository, ctx.idProvider, ctx.eventDispatcher),
        new AddPlayerService(ctx.repository, ctx.eventDispatcher),
        new RemovePlayerService(ctx.repository, ctx.eventDispatcher),
        new StartGameService(ctx.repository, ctx),
        new MovementService(ctx.repository, ctx),
        new RemoveGameService(ctx.repository, ctx.eventDispatcher)
    )
}

