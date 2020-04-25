"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const channel_1 = require("../../src/channel");
const UserConnectionSpy_1 = require("../server/spy/UserConnectionSpy");
const common_1 = require("../../../common");
describe('Channels', () => {
    const event = {
        isError: false,
        type: common_1.EventType.GAME_CREATED,
        origin: undefined
    };
    it('sends to users on channel', () => {
        const userConnection = new UserConnectionSpy_1.UserConnectionSpy();
        const channelName = "some-channel-name";
        const channels = new channel_1.Channels();
        channels.createChannel(channelName);
        channels.addUserToChannel(channelName, userConnection);
        channels.send(channelName, event);
        const receivedMessage = userConnection.receivedMessages[0];
        assert_1.default.deepEqual(receivedMessage, event);
    });
    it('does not send to user on different channel than specified', () => {
        const userA = new UserConnectionSpy_1.UserConnectionSpy();
        const userB = new UserConnectionSpy_1.UserConnectionSpy();
        const channelA = "channel-a";
        const channelB = "channel-b";
        const channels = new channel_1.Channels();
        channels.createChannel(channelA);
        channels.createChannel(channelB);
        channels.addUserToChannel(channelA, userA);
        channels.addUserToChannel(channelB, userB);
        channels.send(channelA, event);
        assert_1.default.equal(userA.receivedMessages.length, 1);
        assert_1.default.equal(userB.receivedMessages.length, 0);
    });
    it('removes user from channel', () => {
        const user = new UserConnectionSpy_1.UserConnectionSpy();
        const channel = "channel-a";
        const channels = new channel_1.Channels();
        channels.createChannel(channel);
        channels.addUserToChannel(channel, user);
        channels.removeUser(channel, user.id);
        channels.send(channel, event);
        assert_1.default.equal(user.receivedMessages.length, 0);
    });
});
//# sourceMappingURL=Channels.test.js.map