import 'mocha';
import assert from 'assert';
import { ChannelNotifierSpy } from './spy/ChannelNotifierSpy';
import { EventDispatcher } from '../../src/event_dispatcher';
import { Event, EventType } from '../../../common';

describe('Event Dispatcher', () => {
    let channelNotifier: ChannelNotifierSpy;
    let eventDispatcher: EventDispatcher;

    beforeEach((done) => {
        channelNotifier = new ChannelNotifierSpy();
        eventDispatcher = new EventDispatcher(channelNotifier);
        done();
    })

    it ('Sends event to the channel of event origin if its provided', () => {
        const event: Event = {
            isError: false,
            type: EventType.PLAYER_MOVED,
            origin: "id1"
        }

        eventDispatcher.dispatch(event);

        const serviceCall = channelNotifier.notifications[0];

        assert.equal(serviceCall.channelName, "id1");
        assert.equal(serviceCall.message, event);
    })

    it ('Send event to the lobby channel if origin is not provided', () => {
        const event: Event = {
            isError: false,
            type: EventType.GAME_CREATED,
            origin: undefined
        }

        eventDispatcher.dispatch(event);

        const serviceCall = channelNotifier.notifications[0];

        assert.equal(serviceCall.channelName, "lobby");
        assert.equal(serviceCall.message, event);
    })
})