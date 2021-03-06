import { GameService, PlayerData, Movement,  GameList, CreateGame, boardDefinition } from  './../../../src/game';
import { Game, GameInfo } from '../../../../common';
import { PlayerCollection } from '../../../src/game/model/PlayerCollection';

export class GameServiceSpy implements GameService
{
    gameStateExample: Game = {
        id: "some-game-id",
        name: "some-game-name",
        players: [],
        currentTurn: {},
        board: []
    }

    gameListExample: GameInfo[] = [{
        id: "some-game-id",
        name: "some-game-name"
    }]

    createdGames: CreateGame[] = [];
    addedPlayers: PlayerData[] = [];
    startRequests: PlayerData[] = [];
    movedPlayers: Movement[] = [];
    newGameId: "id1";
    removedPlayers: PlayerData[] = [];
    removedGames: string[] = [];

    createGame(data: CreateGame, board: boardDefinition[][]): string {
        this.createdGames.push(data);
        return this.newGameId;
    }

    addPlayer(player: PlayerData): void {
        this.addedPlayers.push(player);
    }
    removePlayer(player: PlayerData): void {
        this.removedPlayers.push(player);
    }
    startRequest(player: PlayerData): void {
        this.startRequests.push(player);
    }
    executeMovement(movement: Movement): void {
        this.movedPlayers.push(movement)
    }

    gameState(gameId: string): Game {
        return this.gameStateExample;
    }
    
    gameList(): GameInfo[] {
        return this.gameListExample;
    }

    removeGame(gameId: string): void {
        this.removedGames.push(gameId);
    }
}