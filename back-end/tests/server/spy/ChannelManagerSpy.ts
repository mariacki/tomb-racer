import { ChannelManager, UserConnection } from '../../../src/server';

export class ChannelManagerSpy implements ChannelManager
{
    createdChannels: string[] = [];
    removedChannels: string[] = [];
    usersInChannels: {
        channelName: string,
        user: UserConnection
    }[] = [];

    createChannel(name: string): void
    {
        this.createdChannels.push(name);
    }

    removeChannel(name: string): void
    {
        this.removedChannels.push(name);
    }

    addUserToChannel(channelName: string, user: UserConnection): void {
        this.usersInChannels.push({
            channelName, user
        });
    }
}