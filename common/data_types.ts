export enum TileType {
    PATH = "PATH",
    WALL = "WALL",
    STARTING_POINT = "STARTING_POINT",
    SPIKES = "SPIKES", 
    FINISH_POINT = "FINISH_POINT"
}

export interface Player {
    userId: string,
    userName: string,
    hp: number,
    position: Position
}

export interface Position {
    row: number,
    col: number
}

export type GameId = string;
export type UserId = string;

export interface Turn { 
    currentlyPlaying: string; 
    stepPoints: number; 
}

export interface Tile {
    type: TileType
}

export interface Board {
    tiles: Tile[][]
}

export interface Game {
    id: GameId,
    name: string,
    players: Player[],
    currentTurn: Turn | {},
    board: Tile[][] 
}