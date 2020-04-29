import { 
    Player, 
    Position, 
    GameId, 
    UserId,
    Game,
    Turn, 
} from './data_types';

export enum EventType {
    LOGIN_SUCCESS = "LOGIN-SUCCESS",
    GAME_JOINED = "GAME-JOINED",
    GAME_CREATED = "GAME-CREATED",
    PLAYER_JOINED = "PLAYER-JOINED",
    PLAYER_LEFT = "PLAYER-LEFT",
    GAME_STARTED = "GAME-STARTED",
    PLAYER_MOVED = "PLAYER-MOVED",
    PLAYER_HIT = "PLAYER-HIT",
    NEXT_TURN = "NEXT-TURN",
    PLAYER_DIED = "PLAYER-DIED",
    GAME_FINISHED = "GAME-FINISHED", 
    GAME_REMOVED = "GAME-REMOVED",
    BOARD_CHANGED = "BOARD-CHANGED",
    ITEM_PICKED = "ITEM-PICKED"
}

export enum ErrorType {
    FIELD_REQUIRED = "FIELD REQUIRED",
    FIELD_NOT_UNIQUE = "FIELD NOT UNIQUE",
    GAME_NOT_FOUND = "GAME NOT FOUND",
    NUMBER_OF_STARTING_POINTS_EXCEEDED = "NUMBER OF STARTING POINTS EXCEEDED",
    USER_NOT_FOUND = "USER NOT FOUND",
    CANNOT_START_GAME = "CANNOT START GAME",
    GAME_STARTED_TWICE = "GAME STARTED TWICE",
    INVALID_BOARD = "INVALID BOARD",
    GAME_NOT_STARTED_YET = "GAME_NOT_STARTED_YET",
    INCORRECT_PLAYER_ACTION = "INCORRECT_PLAYER_ACTION",
    INVALID_PATH = "INVALID_PATH",
    PATH_LENGHT_INCORRECT = "PATH LENGTH INCORRECT"
}



export interface Event
{
    isError: boolean,
    type: EventType | ErrorType, 
    origin: GameId | undefined,
}

export interface ItemPicked extends Event
{
    item: string;
    userId: string;
}

export interface GameCreated extends Event
{
    gameName: string,
    gameId: string,
    numberOfPlayers: number
}

export interface GameRemoved extends Event
{
    gameId: string
}

export interface GameFinished extends Event
{
    userId: string   
}

export interface GameInfo {
    id: string, 
    name: string
}

export interface SuccessfullLogin extends Event
{
    games: GameInfo[],
    userId: string;
}

export interface TurnStarted extends Event
{
    turn: Turn
}

export interface PlayerDied extends Event
{
    userId: string,
    movedTo: Position
    hp: number
}

export interface PlayerHit extends Event
{
    userId: string,
    hpTaken: number,
    currentHp: number,
}

export interface PlayerJoined extends Event
{
    player: Player
}

export interface PlayerLeft extends Event
{
    userId: UserId
}

export interface PlayerMoved extends Event
{
    userId: UserId,
    pathUsed: Position[]
}

export interface GameJoined extends Event
{
    currentState: Game;
}

export interface ErrorEvent extends Event
{
    message: string;
}

export interface InvalidGameData extends ErrorEvent
{
    erroneusFieldName: string;
}

export interface GameNameDuplicated extends ErrorEvent
{
    gameName: string
}

export interface GameNotFound extends ErrorEvent
{
    gameId: GameId
}

export interface StartingPointsExceeded extends ErrorEvent
{
    maxNumberOfPlayers: number
}

export interface InvalidPath extends ErrorEvent
{
    invalidSteps: Position[]
}

export interface PathLengthIncorrect extends ErrorEvent
{
    givenLength: number,
    providedLength: number,
}

export interface MinNumberOfStartingPointsNotReached extends ErrorEvent
{
    minNumberOfStartingPoints: number
}

export interface IncorretPlayerAction extends ErrorEvent
{
    playerExecutedAction: UserId,
    playerThatShouldExecuteAction: UserId
}

export interface UserNotFoundInGame extends ErrorEvent
{
    searchedUser: UserId,
}

export interface GameStartedTwiceBySinglePlayer extends ErrorEvent
{
    userId: UserId
}

export interface CannotStartGame extends ErrorEvent
{
    reason: ErrorEvent
}

