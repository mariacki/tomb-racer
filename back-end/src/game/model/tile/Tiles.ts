import { Tile } from './Tile';
import { SipikedTile } from './SpikedTile';

import { TilePosition as Position } from './TilePosition';
import { TileType } from '../../../../../common';

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
    w() {
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