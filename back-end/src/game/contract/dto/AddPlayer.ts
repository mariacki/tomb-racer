export class PlayerData
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