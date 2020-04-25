"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventDispatcherMock {
    constructor() {
        this.dispatchedEvents = [];
        this.eventsByType = new Map();
    }
    dispatch(event) {
        this.dispatchedEvents.push(event);
        this.lastEvent = event;
        if (!this.eventsByType.has(event.type)) {
            this.eventsByType.set(event.type, []);
        }
        this.eventsByType.get(event.type).push(event);
    }
}
exports.EventDispatcherMock = EventDispatcherMock;
//# sourceMappingURL=EventDispatcherMock.js.map