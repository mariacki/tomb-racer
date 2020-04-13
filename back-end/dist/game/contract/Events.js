"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType["GAME_CREATED"] = "GAME-CREATED";
    EventType["PLAYER_JOINED"] = "PLAYER-JOINED";
    EventType["PLAYER_LEFT"] = "PLAYER-LEFT";
    EventType["GAME_STARTED"] = "GAME-STARTED";
    EventType["PLAYER_MOVED"] = "PLAYER-MOVED";
    EventType["PLAYER_HIT"] = "PLAYER-HIT";
    EventType["NEXT_TURN"] = "NEXT-TURN";
    EventType["PLAYER_DIED"] = "PLAYER-DIED";
    EventType["GAME_FINISHED"] = "GAME-FINISHED";
})(EventType = exports.EventType || (exports.EventType = {}));
class Event {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
exports.Event = Event;
//# sourceMappingURL=Events.js.map