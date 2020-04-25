"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(url) {
        this.listeners = new Map();
        this.webSocket = new WebSocket(url);
        this.webSocket.onmessage = (ev) => {
            const event = JSON.parse(ev.data);
            console.log('Server Event', event);
            this.handleServerEvent(event);
        };
    }
    static get() {
        if (!this.instance) {
            this.instance = new Client(process.env.SOCKET_URL);
        }
        return this.instance;
    }
    on(eventType, listener) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType).push(listener);
    }
    handleServerEvent(event) {
        const type = event.type;
        if (!this.listeners.has(type)) {
            return;
        }
        this.listeners.get(type).forEach(listener => listener(event));
    }
    send(command) {
        console.log("Sending: ", command);
        this.webSocket.send(JSON.stringify(command));
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map