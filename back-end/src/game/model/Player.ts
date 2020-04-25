import { TilePosition } from './tile';
import { Player as PlayerState, Event } from 'tr-common';
import { Board } from './Board';
import { Path } from './Path';
import { InvalidPath } from '../errors';
import { PlayerHitEvent } from '../events';

export class Player implements PlayerState{
    userId: string;
    userName: string;
    hp: number = 100;
    inventory: Array<any> = [];
    position: TilePosition
    startedOn: TilePosition

    constructor(
        userId: string,
        userName: string, 
        startingPoisition: TilePosition
    ) {
        this.userId = userId;
        this.userName = userName;
        this.position = startingPoisition;
        this.startedOn = startingPoisition;
    }

    hadDied(): boolean 
    {
        return this.hp <= 0;
    }

    restore() {
        this.position = this.startedOn;
        this.hp = 100;
    }

    takeHit(hpTaken: number)
    {
        this.hp -= hpTaken;
    }
}