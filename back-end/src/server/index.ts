import { GameService, PlayerData, Movement, Tiles } from '../game';
import { Command, Event, CreateGame, JoinGame, EventType, CommandType, Login, Game, MovePlayer } from '../../../common';
import { SuccessfullLogin } from '../../../common';

import  board  from './board';

export interface ChannelManager
{
    createChannel(name: string): void;
    removeChannel(name: string): void;
    addUserToChannel(channelName: string, user: UserConnection): void;
    removeUser(channelName: string, userId: string): void;
}

export interface UserConnection
{
    id: string;
    userName: string;
    gameId: string;
    send(message: Event): void;
}

export class Server 
{
    gameService: GameService
    channelManager: ChannelManager

    private constructor(
        gameService: GameService, 
        channelManager: ChannelManager
    ) {
        this.gameService = gameService;
        this.channelManager = channelManager;
    } 

    static configure(
        gameService: GameService, 
        channelManager: ChannelManager    
    ): Server {
        return new Server(gameService, channelManager);
    }

    connectionLost(caller: UserConnection)
    {
        console.log('Removing: ', caller.userName);

        if (caller.gameId) {
            const playerData = new PlayerData(
                caller.gameId,
                caller.id,
                caller.userName
            );
            
            const game = this.gameService.gameState(caller.gameId);

            console.log("Players before removing", game.players);

            this.gameService.removePlayer(playerData);
            this.channelManager.removeUser(caller.gameId, caller.id);
    
            const game2 = this.gameService.gameState(caller.gameId);

            console.log("Players after removing", game2.players);

            if (game2.players.length === 0) {
                console.log("Removing game", game.name);
                this.gameService.removeGame(caller.gameId);
            }
        }

        if (caller.userName) {
            this.channelManager.removeUser("lobby", caller.id);
        }

        console.log("End routing");
    }

    handleMesage(caller: UserConnection, event: Command)
    {
        try {
            //console.log("Input", event);
            switch (event.type) {
                case CommandType.CREATE_GAME: 
                    this.handleCreateGameCommand(caller, <CreateGame>event);
                    break;
                case CommandType.JOIN_GAME:
                    this.hanleJoinGameCommand(caller, <JoinGame>event);
                    break;
                case CommandType.LOGIN:
                    this.handleLoginCommand(caller, <Login>event);
                    break;
                case CommandType.START_GAME:
                    this.handleStartGameCommand(caller, event);
                    break;
                case CommandType.MOVE:
                    this.handleMoveCommand(caller, <MovePlayer>event);
                    break;
            }
        }
        catch (error) {
            caller.send(error);
        }
    }

    handleCreateGameCommand(caller: UserConnection, command: CreateGame)
    {
        const gameId = this.gameService.createGame(command, board());
        this.channelManager.createChannel(gameId);
    }

    hanleJoinGameCommand(caller: UserConnection, command: JoinGame)
    {
        this.addPlayerToTheGame(caller, command);
        this.sendGameStateToTheCaller(caller, command.gameId);
        caller.gameId = command.gameId;
        this.channelManager.addUserToChannel(command.gameId, caller);
    }

    private addPlayerToTheGame(caller: UserConnection, command: JoinGame) 
    {
        const playerData = new PlayerData(
            command.gameId,
            caller.id,
            caller.userName 
        )
        this.gameService.addPlayer(playerData);
    }

    private sendGameStateToTheCaller(caller: UserConnection, gameId: string)
    {
        const gameState = this.gameService.gameState(gameId);
        caller.send(this.gameStateEvent(gameState));
    }

    private gameStateEvent(gameState: Game)
    {
        return {
            type: EventType.GAME_JOINED,
            isError: false,
            currentState: gameState,
            origin: gameState.id
        }
    }

    handleLoginCommand(caller: UserConnection, command: Login)
    {
        caller.userName = command.userName;
        const gameList = this.gameService.gameList();
        const event: SuccessfullLogin = {
            isError: false,
            origin: undefined,
            type: EventType.LOGIN_SUCCESS,
            games: gameList,
            userId: caller.id
        }
        caller.send(event);
        this.channelManager.addUserToChannel("lobby", caller);
    }

    handleStartGameCommand(caller: UserConnection, command: Command)
    {
        const playerData = new PlayerData(
            caller.gameId,
            caller.id,
            caller.userName
        )
        this.gameService.startRequest(playerData);
    }

    handleMoveCommand(caller: UserConnection, command: MovePlayer)
    {
        const movement = new Movement(
            caller.id, 
            caller.gameId,
            command.path
        )
        this.gameService.executeMovement(movement);
    }
}