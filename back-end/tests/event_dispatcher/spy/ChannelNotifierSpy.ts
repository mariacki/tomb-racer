import { ChannelNotifier } from '../../../src/event_dispatcher';
import { Event } from '../../../../common';

export class ChannelNotifierSpy implements ChannelNotifier
{
    notifications: {
        channelName: string,
        message: Event
    }[] = [];

    send(channelName: string, message: Event): void
    {
        this.notifications.push({
            channelName, message
        })
    }
}