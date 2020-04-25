"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelManagerSpy {
    constructor() {
        this.createdChannels = [];
        this.removedChannels = [];
        this.usersInChannels = [];
        this.removedUsers = [];
    }
    createChannel(name) {
        this.createdChannels.push(name);
    }
    removeChannel(name) {
        this.removedChannels.push(name);
    }
    addUserToChannel(channelName, user) {
        this.usersInChannels.push({
            channelName, user
        });
    }
    removeUser(channelName, userId) {
        this.removedUsers.push({ channelName, userId });
    }
}
exports.ChannelManagerSpy = ChannelManagerSpy;
//# sourceMappingURL=ChannelManagerSpy.js.map