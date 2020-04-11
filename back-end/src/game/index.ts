import * as contract from './contract';
import { DefaultGameService } from './service/DefaultGameService'

export const configure = (
    gameRepository: contract.GameRepository,
    idProvider: contract.IdProvider,
    eventDispatcher: contract.events.EventDispatcher
) => {
    return new DefaultGameService(
        gameRepository,
        idProvider,
        eventDispatcher
    ) 
}

export {
    contract
}