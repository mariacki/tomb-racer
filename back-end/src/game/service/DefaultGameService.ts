import { GameListService } from "./GameListService";
import { GameStateService } from "./GameStateService";
import { CreateGameService } from "./CreateGameService";
import { AddPlayerService } from "./AddPlayerService";
import { RemovePlayerService } from "./RemovePlayer";
import { StartGameService } from "./StartGameService";
import { GameService, PlayerData, Movement } from "../contract";
import { MovementService } from "./MovementService";
import { Game, GameInfo, CreateGame } from "../../../../common";
import { BoardDefinition } from "../model";
import { RemoveGameService } from "./RemoveGameService";

export class DefaultGameService implements GameService
{
    private gameListService: GameListService
    private gameStateService: GameStateService
    private createGameService: CreateGameService
    private addPlayerService: AddPlayerService
    private removePlayerService: RemovePlayerService
    private startGameService: StartGameService
    private movementService: MovementService
    private removeGameService: RemoveGameService

    constructor(
        gameListService: GameListService,
        gameStateService: GameStateService,
        createGameService: CreateGameService,
        addPlayerService: AddPlayerService,
        removePlayerService: RemovePlayerService,
        startGameService: StartGameService,
        movementService: MovementService, 
        removeGameService: RemoveGameService
    ) {
        this.gameListService = gameListService;
        this.gameStateService = gameStateService;
        this.createGameService = createGameService;
        this.addPlayerService = addPlayerService;
        this.removePlayerService = removePlayerService;
        this.startGameService = startGameService;
        this.movementService = movementService;
        this.removeGameService = removeGameService;
    }

    gameState(gameId: string): Game 
    {
        return this.gameStateService.gameState(gameId);    
    }

    gameList(): GameInfo[] 
    {
        return this.gameListService.gameList();
    }

    createGame(data: CreateGame, board: BoardDefinition[][]): string 
    {
        return this.createGameService.createGame(data, board);
    }

    addPlayer(addPlayerRequest: PlayerData) 
    {
        this.addPlayerService.addPlayer(addPlayerRequest);
    }

    removePlayer(removePlayer: PlayerData): void 
    {
        this.removePlayerService.removePlayer(removePlayer);
    }

    startRequest(player: PlayerData): void
    {
        this.startGameService.startRequest(player);
    }

    executeMovement(movement: Movement): void
    {
        this.movementService.executeMovement(movement);
    }

    removeGame(gameId: string): void 
    {   
        this.removeGameService.removeGame(gameId);
    }
}