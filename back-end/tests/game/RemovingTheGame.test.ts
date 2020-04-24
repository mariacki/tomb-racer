import 'mocha';
import assert from 'assert';
import { GameTestContext } from './GameTestContext';
import { Tiles, CreateGame } from '../../src/game';
import { EventType, GameRemoved } from 'tr-common';

describe('Removing the came', () => {
    let ctx = new GameTestContext();
    const defaultBoard = [[Tiles.startingPoint(), Tiles.startingPoint()]];
    
    beforeEach(ctx.initializer());

    it ('causes game do disappear from the game list', () => {
        const gameDef = new CreateGame("some game");
        const gameId = ctx.gameService.createGame(gameDef, defaultBoard);

        ctx.gameService.removeGame(gameId);
        const gameList = ctx.gameService.gameList();

        assert.equal(gameList.length, 0);
    })

    it ('dispatches the game removed event', () => {
        const gameDef = new CreateGame("some game");
        const gameId = ctx.gameService.createGame(gameDef, defaultBoard);

        ctx.gameService.removeGame(gameId);

        const event = <GameRemoved>ctx.eventDispatcher.eventsByType.get(EventType.GAME_REMOVED)[0];

        assert.equal(event.gameId, gameId);
    })
})