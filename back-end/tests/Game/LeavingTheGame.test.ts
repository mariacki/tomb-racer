import 'mocha';
import assert from 'assert';
import { contract, Tiles } from '../../src/game';
import { GameTestContext, UserExample } from './GameTestContext';
import { EventType } from '../../src/game/contract/Events';

describe('Leaving the game', () => {
    const ctx = new GameTestContext();
    const defaultBoard = [[Tiles.startingPoint(), Tiles.startingPoint()]];

    beforeEach(ctx.initializer());
    
    describe('Leaving the game in general', () => {
        it ('does not allow to player to leave if game does not exists', () => {
            ctx.gameService.createGame(new contract.DTO.CreateGame("First Game"), defaultBoard);
            
            assert.throws(() => {
                ctx.gameService.removePlayer(UserExample.invalidGameId);
            }, (err: Error) => {
                assert.deepEqual(err, {
                    type: "GAME NOT FOUND",
                    gameId: "non-existing"
                });

                return true;
            })
        })

        it ('removes player from the list', () => {
            const gameDef = new contract.DTO.CreateGame("Some Name");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(UserExample.first);
            ctx.gameService.addPlayer(UserExample.second);

            ctx.gameService.removePlayer(UserExample.first);

            const players = ctx.gameRepositorySpy.persistedGames[0].players;

            assert.equal(players.length, 1);
        })

        it ('sends PLAYER LEFT event', () => {
            const gameDef = new contract.DTO.CreateGame("Some Game");
            ctx.gameService.createGame(gameDef, defaultBoard);
            ctx.gameService.addPlayer(UserExample.first);

            ctx.gameService.removePlayer(UserExample.first);

            const event = ctx.eventDispatcher.dispatchedEvents[2];

            assert.deepEqual(event, {
                type: EventType.PLAYER_LEFT,
                data: {
                    gameId: "id1",
                    userId: UserExample.first.userId
                }
            })
        })
    })
})