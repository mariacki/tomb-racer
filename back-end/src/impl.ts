import * as Game from './game';
import rnd from './rnd';
import { EventDispatcher } from './event_dispatcher';
import { Channels } from './channel';
import uuid from 'uuid';
import { GameInMemoryRepository } from './repository/GameInMemoryRepository';
import { UserConnection } from './server';
import { Event } from 'tr-common';
import WebSocket from 'ws';

export class WebSocketUserConnection implements UserConnection
{
    id: string;
    userName: string;
    gameId: string;
    conn: WebSocket;

    constructor(conn: WebSocket) {
        this.id = uuid.v4();
        this.conn = conn;
    }

    send(message: Event): void {
        console.log("Output", message);
        const messageString = JSON.stringify(message);
        this.conn.send(messageString);
    }
}

class UuidIdProvider implements Game.IdProvider
{
    newId(): string {
        return uuid.v4();
    }
}

export class AppContext implements Game.Context
{
    eventDispatcher: Game.EventDispatcher;
    idProvider: Game.IdProvider;
    rnd: Game.randomize;
    repository: Game.GameRepository;

    constructor(
        channels: Channels
    ) {
        this.eventDispatcher = new EventDispatcher(channels);
        this.idProvider = new UuidIdProvider();
        this.rnd = rnd;
        this.repository = new GameInMemoryRepository();
    }
}