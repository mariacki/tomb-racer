import 'mocha';
import assert from 'assert';
import { Tiles } from '../../src/game/model/tile';
import { GameTestContext, UserExample } from './GameTestContext';
import { CreateGame } from '../../src/game';

describe('Game data', () => {
    const ctx = new GameTestContext();
    
    beforeEach(ctx.initializer());
    
    it ('Can provide data for single game', () => {
        const gameDef = new  CreateGame("Some Game");
        ctx.gameService.createGame(gameDef, [[Tiles.startingPoint(), Tiles.startingPoint()]]);

        const gameState = ctx.gameService.gameState("id1");

        assert.deepEqual(gameState, {
            id: "id1",
            name: "Some Game",
            players: [],
            currentTurn: {},
            board: [
                [{type: "STARTING_POINT"}, {type: "STARTING_POINT"}]
            ]
        })
    })

    it ('Can provide games list', () => {
        const game1 = new  CreateGame("Game One");
        const game2 = new  CreateGame("Game 2");
        const board = [[Tiles.startingPoint(), Tiles.startingPoint()]]
        ctx.gameService.createGame(game1, board);
        ctx.gameService.createGame(game2, board);

        const gameList = ctx.gameService.gameList();

    })
})