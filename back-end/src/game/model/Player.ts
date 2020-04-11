export default class Player {
    userId: string;
    userName: string;
    hp: number = 100;
    inventory: Array<any> = [];
    position: {row: number, col: number}

    constructor(
        userId: string,
        userName: string, 
    ) {
        this.userId = userId;
        this.userName = userName;
    }
}