import * as contract from "../../../src/game/contract";

export class EventDispatcherMock implements contract.events.EventDispatcher
{
    dispatchedEvents: Array<contract.events.Event> = [];

    dispatch(event: contract.events.Event): void {
        this.dispatchedEvents.push(event)
    }

}