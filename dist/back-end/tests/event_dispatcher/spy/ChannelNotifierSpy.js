"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelNotifierSpy {
    constructor() {
        this.notifications = [];
    }
    send(channelName, message) {
        this.notifications.push({
            channelName, message
        });
    }
}
exports.ChannelNotifierSpy = ChannelNotifierSpy;
//# sourceMappingURL=ChannelNotifierSpy.js.map