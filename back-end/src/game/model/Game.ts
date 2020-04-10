enum State {
    WAITING_FOR_USERS = "WAITING FOR PLAYERS"
}

export class Game 
{
    id: string
    name: string
    players: any = [];
    state: string;

    constructor(
        id: string,
        name: string
    ) {
        this.id = id;
        this.name = name;
        this.state = State.WAITING_FOR_USERS;
    }
}