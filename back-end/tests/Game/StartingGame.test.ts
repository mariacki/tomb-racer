import 'mocha';
import assert from 'assert';
import { contract, Tiles } from '../../src/game';
import { GameTestContext, UserExample } from './GameTestContext';
import { EventType } from '../../src/game/contract/Events';

describe('Starting the game', () => {
    const ctx = new GameTestContext();
    const defaultBoard = [[Tiles.startingPoint(), Tiles.startingPoint()]];
    
    beforeEach(ctx.initializer());

    it ('cannot be done on game that does not exists', () => {
        assert.throws(() => {
            ctx.gameService.startRequest(UserExample.first);
        }, (error) => {
            assert.deepEqual(error, {
                type: "GAME NOT FOUND",
                gameId: "id1"
            })
            return true;
        })
    })

    it ('cannot be done twice by the user that is not in the game', () => {
        const gameDef = new contract.DTO.CreateGame("Some Game");
        ctx.gameService.addPlayer(UserExample.first);

        assert.throws(() => {
            ctx.gameService.startRequest(UserExample.second);
        }, (error) => {
            assert.deepEqual(error, {
                type: "CANNOT START GAME"
            })
            return true;
        })
    })
})