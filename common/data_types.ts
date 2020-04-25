export enum TileType {
    PATH = "PATH",
    WALL = "WALL",
    STARTING_POINT = "STARTING_POINT",
    SPIKES = "SPIKES", 
    FINISH_POINT = "FINISH_POINT",
    
    KEY_ONE = "K1",
    KEY_TWO = "K2",
    KEY_THREE = "K3",
    KEY_FOUR = "K4",

    HOLE_ONE = "H1",
    HOLE_TWO = "H2",
    HOLE_THREE = "H3",
    HOLE_FOUR = "H4",

    KILL_RADNOM = "K1",
    KILL_ALL = "K2",
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