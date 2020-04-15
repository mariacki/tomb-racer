import { randomize } from '../contract';
import { Turn } from 'tr-common';

const CUBE_START = 1;
const CUBE_END = 6;

export class GameTurn implements Turn
{
    currentlyPlaying: string;
    stepPoints: number;
    
    constructor(userId: string, rand: randomize) {
        this.currentlyPlaying = userId;
        this.stepPoints = rand(CUBE_START, CUBE_END);
    }
    
}