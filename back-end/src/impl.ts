import Context from "./game/contract/Context";
import { EventDispatcher, Event, EventType } from './game/contract/Events';
import { IdProvider, GameRepository, randomize } from './game/contract';
import { GameInMemoryRepository } from "./repository/GameInMemoryRepository";
import rnd from './rnd';
import uuid from 'uuid';
import WebSocket from 'ws';

class WsEventDispatcher implements EventDispatcher {
    
    channels: Map<String, WebSocket[]>;

    constructor(channels: Map<String, WebSocket[]>) {
        this.channels = channels;
    }
    
    dispatch(event: Event): void {
        if (event.type == EventType.GAME_CREATED) {
            this.channels.set(event.data.gameId, []);

            this.channels.get("lounge").forEach((ws) => {
                ws.send(JSON.stringify(event));
            });

        
        }

        const gameId = event.data.gameId;
        const channel = this.channels.get(gameId);

        channel.forEach((ws: WebSocket) => {
            ws.send(JSON.stringify(event))
        })
    }
}

class UuidIdProvider implements IdProvider
{
    newId(): string {
        return uuid.v4();
    }
}

export default class WebSocketContext implements Context
{
    eventDispatcher: EventDispatcher;
    idProvider: IdProvider;
    rnd: randomize;
    repository: GameRepository;
    
    constructor(channels: Map<String, WebSocket[]>) {
        this.eventDispatcher = new WsEventDispatcher(channels);
        this.idProvider = new UuidIdProvider();
        this.rnd = rnd;
        this.repository = new GameInMemoryRepository();
    }
}