export interface PlayerState {
    userId: string,
    userName: string,
    hp: number,
    position: {
        row: number,
        col: number
    }
}

export interface TurnState {
    userId: string,
    stepPoints: number
}

export interface TileState {
    type: string,
}

export interface GameState {
    gameId: string,
    gameName: string,
    players: PlayerState[],
    currentTurn: TurnState | {}
    board: TileState[][]
}

export interface GameInfo {
    gameId: string,
    gameName: string
}

export interface GameList {
    games: GameInfo[]
}