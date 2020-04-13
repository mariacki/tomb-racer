"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType[EventType["GAME_CREATED"] = 0] = "GAME_CREATED";
    EventType[EventType["PLAYER_JOINED"] = 1] = "PLAYER_JOINED";
    EventType[EventType["PLAYER_LEFT"] = 2] = "PLAYER_LEFT";
    EventType[EventType["GAME_STARTED"] = 3] = "GAME_STARTED";
    EventType[EventType["PLAYER_MOVED"] = 4] = "PLAYER_MOVED";
    EventType[EventType["PLAYER_HIT"] = 5] = "PLAYER_HIT";
    EventType[EventType["NEXT_TURN"] = 6] = "NEXT_TURN";
    EventType[EventType["PLAYER_DIED"] = 7] = "PLAYER_DIED";
    EventType[EventType["GAME_FINISHED"] = 8] = "GAME_FINISHED";
})(EventType = exports.EventType || (exports.EventType = {}));
class Event {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
exports.Event = Event;
//# sourceMappingURL=Events.js.map