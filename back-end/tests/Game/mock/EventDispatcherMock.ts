import { EventType, Event, EventDispatcher } from "../../../src/game/contract/Events";

export class EventDispatcherMock implements EventDispatcher
{
    dispatchedEvents: Array<Event> = [];
    lastEvent: Event;

    eventsByType: Map<EventType, Event[]> = new Map();

    dispatch(event: Event): void {
        this.dispatchedEvents.push(event)
        this.lastEvent = event;
        
        if (!this.eventsByType.has(event.type)) {
            this.eventsByType.set(event.type, []);
        }

        this.eventsByType.get(event.type).push(event);
    }

}