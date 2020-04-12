import Position from "./Position";

export default class Movement
{
    userId: string;
    gameId: string;
    path: Position[]; 

    constructor(
        userId: string,
        gameId: string,
        path: Position[]
    ) {
        this.userId = userId;
        this.gameId = gameId;
        this.path = path;
    }
}