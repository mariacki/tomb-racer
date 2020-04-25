"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventDispatcher {
    constructor(channelNotifier) {
        this.channelNotifier = channelNotifier;
    }
    dispatch(event) {
        const channelName = event.origin ? event.origin : "lobby";
        this.channelNotifier.send(channelName, event);
    }
}
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=index.js.map