import 'mocha';
import assert from 'assert';
import { Tiles } from '../../src/game/model/tile';
import { GameTestContext, UserExample } from './GameTestContext';
import { Movement, Position } from '../../src/game/contract/dto';
import { EventType } from 'tr-common';
import * as contract from '../../src/game/contract';

describe('Finishing game', () => {
    const board = [
        [Tiles.startingPoint(), Tiles.startingPoint(), Tiles.startingPoint()],
        [Tiles.finishPoint(),   Tiles.path(),          Tiles.path()]
    ]

    const ctx = new GameTestContext();
    ctx.randomResult = 1;

    beforeEach(ctx.initializer());
    
    it ('happens when player stands on finish tile', () => {
        const movement = new Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            [new Position(1, 0)]
        )
        ctx.startGame(board);
        
        ctx.gameService.executeMovement(movement);

        const game = ctx.gameRepositorySpy.lastPersistedGame;
        const event: any = ctx.eventDispatcher.eventsByType.get(EventType.GAME_FINISHED)[0];

        assert.equal(game.state, "FINISHED")
        assert.equal(event.origin, UserExample.first.gameId);
        assert.equal(event.userId, UserExample.first.userId);
    })
})