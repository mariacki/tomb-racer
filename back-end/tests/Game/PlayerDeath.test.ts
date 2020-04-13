import 'mocha';
import assert from 'assert';
import { contract, Tiles } from '../../src/game';
import { GameTestContext, UserExample } from './GameTestContext';
import { EventType } from '../../src/game/contract/Events';
import Position from '../../src/game/contract/dto/Position';
import { ErrorType } from 'tr-common/events';
/*
describe('Player death', () => {
    const board = [
        [Tiles.startingPoint(), Tiles.startingPoint(), Tiles.startingPoint()],
        [Tiles.spikes(),        Tiles.path(),          Tiles.spikes()]
    ]
    const ctx = new GameTestContext();

    beforeEach(ctx.initializer());

    it ('should happen when player hp is 0', () => {
        ctx.randomResult = 2;
        const player1movement = new contract.DTO.Movement(
            UserExample.first.userId,
            UserExample.first.gameId,
            [
                new Position(1, 0),
                new Position(1, 1)
            ]
        )   

        const player2movement = new contract.DTO.Movement(
            UserExample.second.userId,
            UserExample.second.gameId,
            [
                new Position(1, 1),
                new Position(1, 0)
            ]
        )

        ctx.startGame(board);
        
        const player1 = ctx.gameRepositorySpy.lastPersistedGame.players[0];
        const player2 = ctx.gameRepositorySpy.lastPersistedGame.players[1];

        player1.hp = 20;
        player2.hp = 20;

        ctx.gameService.executeMovement(player1movement);
        ctx.gameService.executeMovement(player2movement);

        assert.equal(player1.hp, 100);
        assert.equal(player1.position.row, 0);
        assert.equal(player1.position.col, 0)

        assert.equal(player2.hp, 100);
        assert.equal(player2.position.row, 0);
        assert.equal(player2.position.col, 1);

        const events = ctx.eventDispatcher.eventsByType.get(EventType.PLAYER_DIED);
        
        assert.equal(events[0].data.gameId, "id1");
        assert.equal(events[1].data.gameId, "id1");

        assert.equal(events[0].data.userId, UserExample.first.userId);
        assert.equal(events[1].data.userId, UserExample.second.userId);

        assert.deepEqual(events[0].data.movedTo, {row: 0, col: 0});
        assert.deepEqual(events[1].data.movedTo, {row: 0, col: 1});
    })
})*/