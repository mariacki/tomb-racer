import { 
    SuccessfullLogin, 
    Command, 
    Event, 
    EventType, 
    GameCreated, 
    GameJoined, 
    TurnStarted, 
    PlayerJoined, 
    PlayerMoved, 
    PlayerHit, 
    PlayerDied, 
    GameFinished
} from 'tr-common';


export class Client
{
    private webSocket: WebSocket
    private listeners: Map<EventType, Function[]> = new Map();

    private static instance: Client;

    private constructor(url: string) {
        this.webSocket = new WebSocket(url);
        this.webSocket.onmessage = (ev: MessageEvent) => {
            const event: Event = JSON.parse(ev.data);
            console.log('Server Event', event);
            this.handleServerEvent(event);
        }
    }

    static get(): Client {
        if (!this.instance) {
            this.instance = new Client(process.env.SOCKET_URL)
        }

        return this.instance;
    }

    on(eventType: EventType, listener: Function)
    {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, [])
        }

        this.listeners.get(eventType).push(listener);
    }

    private handleServerEvent(event: Event)
    {
        const type = <EventType>event.type;

        if (!this.listeners.has(type)) {
            return;
        }

        this.listeners.get(type).forEach(listener => listener(event));
    }

    send(command: Command) {
        console.log("Sending: ",command);
        this.webSocket.send(
            JSON.stringify(command)
        )
    }
}