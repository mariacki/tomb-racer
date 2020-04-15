import { Context } from './contract';
import { DefaultGameService } from './service/DefaultGameService';

export * from './contract';

export const configure = (
    ctx: Context
) => {
    return new DefaultGameService(ctx) 
}

