import { randomize } from '../contract';
import { Turn } from '../../../../common';

const CUBE_START = 1;
const CUBE_END = 6;

export class GameTurn implements Turn
{
    currentlyPlaying: string;
    stepPoints: number;
    
    constructor(userId: string, diceRoll: number) {
        this.currentlyPlaying = userId;
        this.stepPoints = diceRoll;
    }
    
}