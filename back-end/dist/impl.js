"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("./game/contract/Events");
const GameInMemoryRepository_1 = require("./repository/GameInMemoryRepository");
const rnd_1 = __importDefault(require("./rnd"));
const uuid_1 = __importDefault(require("uuid"));
class WsEventDispatcher {
    constructor(channels) {
        this.channels = channels;
    }
    dispatch(event) {
        if (event.type == Events_1.EventType.GAME_CREATED) {
            this.channels.set(event.data.gameId, []);
            this.channels.get("lounge").forEach((ws) => {
                ws.send(JSON.stringify(event));
            });
        }
        const gameId = event.data.gameId;
        const channel = this.channels.get(gameId);
        channel.forEach((ws) => {
            ws.send(JSON.stringify(event));
        });
    }
}
class UuidIdProvider {
    newId() {
        return uuid_1.default.v4();
    }
}
class WebSocketContext {
    constructor(channels) {
        this.eventDispatcher = new WsEventDispatcher(channels);
        this.idProvider = new UuidIdProvider();
        this.rnd = rnd_1.default;
        this.repository = new GameInMemoryRepository_1.GameInMemoryRepository();
    }
}
exports.default = WebSocketContext;
//# sourceMappingURL=impl.js.map