import CreateGame from './dto/CreateGame';
import { AddPlayer } from './dto';

export interface GameService
{
    createGame(data: CreateGame, board: Array<any>): void;
    addPlayer(player: AddPlayer): void;
}