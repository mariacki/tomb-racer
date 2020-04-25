"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rnd_1 = __importDefault(require("./rnd"));
const event_dispatcher_1 = require("./event_dispatcher");
const uuid_1 = __importDefault(require("uuid"));
const GameInMemoryRepository_1 = require("./repository/GameInMemoryRepository");
class WebSocketUserConnection {
    constructor(conn) {
        this.id = uuid_1.default.v4();
        this.conn = conn;
    }
    send(message) {
        console.log("Output", message);
        const messageString = JSON.stringify(message);
        this.conn.send(messageString);
    }
}
exports.WebSocketUserConnection = WebSocketUserConnection;
class UuidIdProvider {
    newId() {
        return uuid_1.default.v4();
    }
}
class AppContext {
    constructor(channels) {
        this.eventDispatcher = new event_dispatcher_1.EventDispatcher(channels);
        this.idProvider = new UuidIdProvider();
        this.rnd = rnd_1.default;
        this.repository = new GameInMemoryRepository_1.GameInMemoryRepository();
    }
}
exports.AppContext = AppContext;
//# sourceMappingURL=impl.js.map