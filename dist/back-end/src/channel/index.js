"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Channel {
    constructor() {
        this.connections = [];
    }
    notifyAll(event) {
        this.connections.forEach(connection => connection.send(event));
    }
    addUser(user) {
        this.connections.push(user);
    }
    remove(userId) {
        this.connections = this.connections.filter((user) => {
            return user.id != userId;
        });
    }
}
class Channels {
    constructor() {
        this.channels = new Map();
    }
    createChannel(name) {
        this.channels.set(name, new Channel());
    }
    removeChannel(name) {
        throw new Error("Method not implemented.");
    }
    addUserToChannel(channelName, user) {
        this.channels.get(channelName).addUser(user);
    }
    send(channelName, message) {
        if (!this.channels.has(channelName)) {
            console.log('Undefined channel ' + channelName);
        }
        this.channels.get(channelName).notifyAll(message);
    }
    removeUser(channelName, userId) {
        this.channels.get(channelName).remove(userId);
    }
}
exports.Channels = Channels;
//# sourceMappingURL=index.js.map