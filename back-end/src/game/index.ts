import { Context } from './contract';
import { DefaultGameService } from './service/DefaultGameService';


export * from './contract';
export * from './model/tile';

export const configure = (
    ctx: Context
) => {
    return new DefaultGameService(ctx) 
}

