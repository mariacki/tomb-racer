import {configure, contract, Tiles} from '../../src/game';
import { GameRepositorySpy } from './spy/GameRepositorySpy';
import { IdProviderMock } from './mock/IdProviderMock';
import { EventDispatcherMock } from './mock/EventDispatcherMock';
import Context  from '../../src/game/contract/Context';
import { boardDefinition } from '../../src/game/contract';

export const UserExample = {
    first: new contract.DTO.PlayerData("id1", "user-id-1", "username-1"),
    second: new contract.DTO.PlayerData("id1", "user-id-2", "username-2"),
    third: new contract.DTO.PlayerData("id1", "user-id-3", "username-3"),
    invalidGameId: new contract.DTO.PlayerData("non-existing", "user-id-invalid", "username-invalid")
}

export class GameTestContext {
    gameService: contract.GameService;
    gameRepositorySpy: GameRepositorySpy;
    idProvider: IdProviderMock;
    eventDispatcher: EventDispatcherMock;

    randomResult: number = 0;

    randomizer: contract.randomize = (start: number, end: number) => {
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
        const gameDef = new contract.DTO.CreateGame("Some Game");
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