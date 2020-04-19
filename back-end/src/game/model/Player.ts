import { TilePosition } from './tile';
import { Player as PlayerState } from 'tr-common';

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
    ) {
        this.userId = userId;
        this.userName = userName;
    }

    hadDied(): boolean 
    {
        return this.hp <= 0;
    }

    restore() {
        this.position = this.startedOn;
        this.hp = 100;
    }
}