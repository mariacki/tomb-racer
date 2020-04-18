import { Event } from "tr-common";
import { EventDispatcher as IEventDispatcher } from '../game';

export interface ChannelNotifier
{
    send(channelName: string, message: Event): void;
}

export class EventDispatcher implements IEventDispatcher
{
    channelNotifier: ChannelNotifier;

    constructor(channelNotifier: ChannelNotifier) {
        this.channelNotifier = channelNotifier;
    }

    dispatch(event: Event): void 
    {
        const channelName = event.origin ? event.origin : "lobby";
        this.channelNotifier.send(channelName, event);
    }
}