import { CreateGame, PlayerData, Movement, GameList } from '.';
import { Tile, Game as GameState, GameInfo } from 'tr-common';

export type boardDefinition = (row: number, col: number) => Tile;

export interface GameService
{
    createGame(data: CreateGame, board: boardDefinition[][]): string;
    addPlayer(player: PlayerData): void;
    removePlayer(player: PlayerData): void;
    startRequest(player: PlayerData): void;
    executeMovement(movement: Movement): void;
    gameState(gameId: string): GameState
    gameList(): GameInfo[]
}