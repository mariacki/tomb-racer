import * as contract from './contract';
import { DefaultGameService } from './service/DefaultGameService'
import { TileType, Tile, Position } from './model/tile/Tile';

export const Tiles = {
    startingPoint() {
        return (row: number, col: number) => {
            return new Tile(
                TileType.STARTING_POINT, 
                new Position(row,col)
            );
        }
    }
}

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