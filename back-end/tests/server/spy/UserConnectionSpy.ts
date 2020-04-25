import { UserConnection } from '../../../src/server';
import { Event } from '../../../../common';

export class UserConnectionSpy implements UserConnection {
    receivedMessages: Event[] = [];
    
    id: string;
    gameId: string;
    userName: string;
    
    send(message: Event): void
    {
        this.receivedMessages.push(message);
    }
}