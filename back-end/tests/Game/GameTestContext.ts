import {configure, contract} from '../../src/game';
import { GameRepositorySpy } from './spy/GameRepositorySpy';
import { IdProviderMock } from './mock/IdProviderMock';
import { EventDispatcherMock } from './mock/EventDispatcherMock';

export const UserExample = {
    first: new contract.DTO.AddPlayer("id1", "user-id-1", "username-1"),
    second: new contract.DTO.AddPlayer("id1", "user-id-2", "username-2"),
    thrid: new contract.DTO.AddPlayer("id1", "user-id-3", "username-3"),
    invalidGameId: new contract.DTO.AddPlayer("non-existing", "user-id-invalid", "username-invalid")
}

export class GameTestContext {
    gameService: contract.GameService;
    gameRepositorySpy: GameRepositorySpy;
    idProvider: IdProviderMock;
    eventDispatcher: EventDispatcherMock;
    
    initializer(): Mocha.Func {
        return (done) => {
            this.gameRepositorySpy = new GameRepositorySpy();
            this.idProvider = new IdProviderMock();
            this.eventDispatcher = new EventDispatcherMock();
            this.gameService = configure(
                this.gameRepositorySpy,
                this.idProvider,
                this.eventDispatcher
            );

            done();
        }
    }
}