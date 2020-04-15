"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType["LOGIN_SUCCESS"] = "LOGIN-SUCCESS";
    EventType["GAME_JOINED"] = "GAME-JOINED";
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
var ErrorType;
(function (ErrorType) {
    ErrorType["FIELD_REQUIRED"] = "FIELD REQUIRED";
    ErrorType["FIELD_NOT_UNIQUE"] = "FIELD NOT UNIQUE";
    ErrorType["GAME_NOT_FOUND"] = "GAME NOT FOUND";
    ErrorType["NUMBER_OF_STARTING_POINTS_EXCEEDED"] = "NUMBER OF STARTING POINTS EXCEEDED";
    ErrorType["USER_NOT_FOUND"] = "USER NOT FOUND";
    ErrorType["CANNOT_START_GAME"] = "CANNOT START GAME";
    ErrorType["GAME_STARTED_TWICE"] = "GAME STARTED TWICE";
    ErrorType["INVALID_BOARD"] = "INVALID BOARD";
    ErrorType["GAME_NOT_STARTED_YET"] = "GAME_NOT_STARTED_YET";
    ErrorType["INCORRECT_PLAYER_ACTION"] = "INCORRECT_PLAYER_ACTION";
    ErrorType["INVALID_PATH"] = "INVALID_PATH";
    ErrorType["PATH_LENGHT_INCORRECT"] = "PATH LENGTH INCORRECT";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
//# sourceMappingURL=events.js.map