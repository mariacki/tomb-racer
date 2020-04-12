import { Position } from "../contract/dto";

export default class Player {
    userId: string;
    userName: string;
    hp: number = 100;
    inventory: Array<any> = [];
    position: Position
    startedOn: Position

    constructor(
        userId: string,
        userName: string, 
    ) {
        this.userId = userId;
        this.userName = userName;
    }
}