import { Login, SuccessfullLogin, CommandType, Command, Event, EventType, GameCreated, GameJoined, TurnStarted, PlayerJoined, PlayerMoved, PlayerHit, PlayerDied } from 'tr-common';

export interface EventsListener
{
    onPlayerMoved(event: PlayerMoved);
    onPlayerHit(event: PlayerHit);
    onPlayerDied(event: PlayerDied);
    onGameFinished(event: PlayerDied);
    onLoginSuccess(event: SuccessfullLogin): void;
    onGameCreated(event: GameCreated): void;
    onGameJoined(event: GameJoined): void;
    onNextTurn(event: TurnStarted): void
    onPlayerJoined(event: PlayerJoined): void;
}

export class Client
{
    webSocket: WebSocket
    listener: EventsListener;
    
    constructor(url: string) {
        this.webSocket = new WebSocket(url);
        this.webSocket.onmessage = (ev: MessageEvent) => {
            const event: Event = JSON.parse(ev.data);
            console.log('Server Event', event);
            this.handleServerEvent(event);
        }
    }

    setEventListener(listener: EventsListener)
    {
        this.listener = listener;
    }

    private handleServerEvent(event: Event)
    {
        if (event.isError) {
            this.handleErrorEvent(event);
        } else {
            this.handleEvent(event);
        }    
    }

    private handleErrorEvent(event: Event)
    {

    }

    private handleEvent(event: Event) {
        switch (event.type) {
            case EventType.LOGIN_SUCCESS:
                this.listener.onLoginSuccess(<SuccessfullLogin>event);
                break;
            case EventType.GAME_CREATED:
                this.listener.onGameCreated(<GameCreated>event);
                break;
            case EventType.GAME_JOINED:
                this.listener.onGameJoined(<GameJoined>event);
                break;
            case EventType.NEXT_TURN:
                this.listener.onNextTurn(<TurnStarted>event);
                break;
            case EventType.PLAYER_JOINED:
                this.listener.onPlayerJoined(<PlayerJoined>event);
                break;
            case EventType.PLAYER_MOVED:
                this.listener.onPlayerMoved(<PlayerMoved>event);
                break;
            case EventType.PLAYER_HIT:
                this.listener.onPlayerHit(<PlayerHit>event);
                break;
            case EventType.PLAYER_DIED:
                this.listener.onPlayerDied(<PlayerDied>event);
                break;
            case EventType.GAME_FINISHED:
                this.listener.onGameFinished(<PlayerDied>event);
                break;

        }
    }

    send(command: Command) {
        console.log("Sending: ",command);
        this.webSocket.send(
            JSON.stringify(command)
        )
    }
}