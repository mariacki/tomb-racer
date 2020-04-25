import { ChannelManager } from "../server";
import { ChannelNotifier } from "../event_dispatcher";
import { UserConnection } from "../server";
import { Event } from "../../../common";

class Channel 
{
    connections: UserConnection[] = [];

    notifyAll(event: Event) {
        this.connections.forEach(connection => connection.send(event))
    }

    addUser(user: UserConnection) {
        this.connections.push(user);
    }

    remove(userId: string)
    {
        this.connections = this.connections.filter((user) => {
            return user.id != userId;
        })
    }
}

export class Channels implements ChannelManager, ChannelNotifier
{
    channels: Map<string, Channel> = new Map();
    
    createChannel(name: string): void
    {
        this.channels.set(name, new Channel());
    }
    
    removeChannel(name: string): void
    {
        throw new Error("Method not implemented.");
    }
    
    addUserToChannel(channelName: string, user: UserConnection): void 
    {
        this.channels.get(channelName).addUser(user);        
    }
    
    send(channelName: string, message: Event): void
    {
        if (!this.channels.has(channelName)) {
            console.log('Undefined channel ' + channelName) 
        }
        this.channels.get(channelName).notifyAll(message);
    }

    removeUser(channelName: string, userId: string) 
    {
        this.channels.get(channelName).remove(userId);
    }
}