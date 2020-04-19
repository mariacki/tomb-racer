import 'mocha';
import assert from 'assert';
import { Channels } from '../../src/channel';
import { UserConnectionSpy } from '../server/spy/UserConnectionSpy';
import { Event, EventType } from 'tr-common';



describe('Channels', () => {

    const event: Event = {
        isError: false,
        type: EventType.GAME_CREATED,
        origin: undefined
    }

    it ('sends to users on channel', () => {
        const userConnection = new UserConnectionSpy();
        const channelName = "some-channel-name";
        const channels = new Channels();

        channels.createChannel(channelName);
        channels.addUserToChannel(channelName, userConnection);
        channels.send(channelName, event);

        const receivedMessage = userConnection.receivedMessages[0];
        assert.deepEqual(receivedMessage, event);
    })

    it ('does not send to user on different channel than specified', () => {
        const userA = new UserConnectionSpy();
        const userB = new UserConnectionSpy();
        const channelA = "channel-a";
        const channelB = "channel-b";
        const channels = new Channels();

        channels.createChannel(channelA);
        channels.createChannel(channelB);

        channels.addUserToChannel(channelA, userA);
        channels.addUserToChannel(channelB, userB);

        channels.send(channelA, event);

        assert.equal(userA.receivedMessages.length, 1);
        assert.equal(userB.receivedMessages.length, 0);
    })

    it ('removes user from channel', () => {
        const user = new UserConnectionSpy();
        const channel = "channel-a";
        const channels = new Channels();

        channels.createChannel(channel);

        channels.addUserToChannel(channel, user);
        channels.removeUser(channel, user.id);

        channels.send(channel, event);
        assert.equal(user.receivedMessages.length, 0);
    })
})