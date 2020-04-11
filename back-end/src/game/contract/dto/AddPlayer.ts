import { stringify } from "querystring";

export default class AddPlayer
{
    userId: string;
    userName: string;
    gameId: string;

    constructor(gameId: string, userId: string, userName: string) {
        this.gameId = gameId;
        this.userId = userId;
        this.userName = userName;
    }
}