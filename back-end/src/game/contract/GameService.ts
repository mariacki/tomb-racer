import CreateGame from './dto/CreateGame';
import { AddPlayer } from './dto';
import { Tile } from '../model/tile/Tile';

export type boardDefinition = (row: number, col: number) => Tile;

export interface GameService
{
    createGame(data: CreateGame, board: boardDefinition[][]): void;
    addPlayer(player: AddPlayer): void;
    removePlayer(player: AddPlayer): void;
    startRequest(player: AddPlayer): void;
}