import 'mocha';
import assert from 'assert';
import { contract, Tiles } from '../../src/game';
import { GameTestContext, UserExample } from './GameTestContext';

describe('Game data', () => {
    const ctx = new GameTestContext();
    
    beforeEach(ctx.initializer());
    
    it ('Can provide data for single game', () => {
        const gameDef = new contract.DTO.CreateGame("Some Game");
        ctx.gameService.createGame(gameDef, [[Tiles.startingPoint(), Tiles.startingPoint()]]);

        const gameState = ctx.gameService.gameState("id1");

        assert.deepEqual(gameState, {
            gameId: "id1",
            gameName: "Some Game",
            players: [],
            currentTurn: {},
            board: [
                [{type: "STARTING_POINT"}, {type: "STARTING_POINT"}]
            ]
        })
    })

    it ('Can provide games list', () => {
        const game1 = new contract.DTO.CreateGame("Game One");
        const game2 = new contract.DTO.CreateGame("Game 2");
        const board = [[Tiles.startingPoint(), Tiles.startingPoint()]]
        ctx.gameService.createGame(game1, board);
        ctx.gameService.createGame(game2, board);

        const gameList = ctx.gameService.gameList();

    })
})