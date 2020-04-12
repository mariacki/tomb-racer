import CreateGame from './dto/CreateGame';
import { PlayerData } from './dto';
import { Tile } from '../model/tile/Tile';
import Movement from './dto/Movement';

export type boardDefinition = (row: number, col: number) => Tile;

export interface GameService
{
    createGame(data: CreateGame, board: boardDefinition[][]): void;
    addPlayer(player: PlayerData): void;
    removePlayer(player: PlayerData): void;
    startRequest(player: PlayerData): void;
    executeMovement(movement: Movement): void;
}