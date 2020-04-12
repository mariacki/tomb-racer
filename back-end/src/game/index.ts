import * as contract from './contract';
import { DefaultGameService } from './service/DefaultGameService'
import { TileType, Tile, SipikedTile } from './model/tile/Tile';
import Context  from './contract/Context';
import Position from './contract/dto/Position';

export const Tiles = {
    startingPoint() {
        return (row: number, col: number) => {
            return new Tile(
                TileType.STARTING_POINT, 
                new Position(row,col)
            );
        }
    }, 
    path() {
        return (row: number, col: number) => {
            return new Tile(TileType.PATH, new Position(row, col))
        }
    },
    wall() {
        return (row: number, col: number) => {
            return new Tile(TileType.WALL, new Position(row, col))
        }
    },
    spikes() {
        return (row: number, col: number) => {
            return new SipikedTile(new Position(row, col));
        }
    }, 
    finishPoint() {
        return (row: number, col: number) => {
            return new Tile(TileType.FINISH_POINT, new Position(row, col));
        }
    }
}

export const configure = (
    ctx: Context
) => {
    return new DefaultGameService(ctx) 
}

export {
    contract
}