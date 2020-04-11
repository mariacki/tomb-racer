import {configure, contract} from '../../src/game';
import { GameRepositorySpy } from './spy/GameRepositorySpy';
import { IdProviderMock } from './mock/IdProviderMock';
import { EventDispatcherMock } from './mock/EventDispatcherMock';

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