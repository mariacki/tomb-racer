import { randomize } from "../contract";
import { TurnState } from "../contract/dto/GameState";

const CUBE_START = 1;
const CUBE_END = 6;

export default class Turn
{
    userId: string;
    actionPoints: number = 3;
    stepPoints: number;

    constructor(userId: string, rand: randomize) {
        this.userId = userId;
        this.stepPoints = rand(CUBE_START, CUBE_END);
    }

    state(): TurnState {
        return {
            userId: this.userId,
            stepPoints: this.stepPoints
        }
    }
}