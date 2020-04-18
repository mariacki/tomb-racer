import { GameId, UserId, Position } from "./data_types";
export declare enum CommandType {
    LOGIN = "LOGIN",
    CREATE_GAME = "CREATE-GAME",
    JOIN_GAME = "JOIN-GAME",
    START_GAME = "START-GAME",
    MOVE = "MOVE"
}
export interface Command {
    type: CommandType;
}
export interface Login extends Command {
    userName: string;
}
export interface CreateGame extends Command {
    gameName: string;
}
export interface User {
    id: UserId;
    name: string;
}
export interface JoinGame extends Command {
    gameId: string;
}
export interface MovePlayer extends Command {
    path: Position[];
}
export interface LeaveGame extends Command {
    gameId: GameId;
    userId: UserId;
}
