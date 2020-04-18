import {configure} from '../../src/game';
import { GameRepositorySpy } from './spy/GameRepositorySpy';
import { IdProviderMock } from './mock/IdProviderMock';
import { EventDispatcherMock } from './mock/EventDispatcherMock';
import { Context, GameService, EventDispatcher, CreateGame, PlayerData, randomize } from '../../src/game/contract'
import { boardDefinition } from '../../src/game/contract';
import { Tiles } from '../../src/game/model/tile'

export const UserExample = {
    first: new  PlayerData("id1", "user-id-1", "username-1"),
    second: new  PlayerData("id1", "user-id-2", "username-2"),
    third: new  PlayerData("id1", "user-id-3", "username-3"),
    invalidGameId: new  PlayerData("non-existing", "user-id-invalid", "username-invalid")
}

export class GameTestContext {
    gameService: GameService;
    gameRepositorySpy: GameRepositorySpy;
    idProvider: IdProviderMock;
    eventDispatcher: EventDispatcherMock;

    randomResult: number = 0;

    randomizer: randomize = (start: number, end: number) => {
        return this.randomResult;
    }
    
    initializer(): Mocha.Func {
        return (done) => {
            this.gameRepositorySpy = new GameRepositorySpy();
            this.idProvider = new IdProviderMock();
            this.eventDispatcher = new EventDispatcherMock();

            const context = new Context(
                this.eventDispatcher, 
                this.idProvider, 
                this.gameRepositorySpy, 
                this.randomizer
            );

            this.gameService = configure(context);

            done();
        }
    }

    startGame(board: boardDefinition[][] = this.defaultBoard()) {
        const gameDef = new CreateGame("Some Game");
        this.gameService.createGame(gameDef, board);
        this.gameService.addPlayer(UserExample.first);
        this.gameService.addPlayer(UserExample.second);
        this.gameService.addPlayer(UserExample.third);

        this.gameService.startRequest(UserExample.first);
        this.gameService.startRequest(UserExample.second);
        this.gameService.startRequest(UserExample.third);
    }

    private defaultBoard() {
        return [[Tiles.startingPoint(), Tiles.startingPoint(), Tiles.startingPoint()]];
    }
}