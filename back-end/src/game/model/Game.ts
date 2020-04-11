import Player from "./Player";
import { Board } from "./Board";
import { NumberOfStartingPointsExceeded } from "../errors";

enum State {
    WAITING_FOR_USERS = "WAITING FOR PLAYERS"
}

export default class Game 
{
    id: string
    name: string
    players: Array<Player> = [];
    state: string;
    board: Board

    constructor(
        id: string,
        name: string,
        board: Board,
    ) {
        this.id = id;
        this.name = name;
        this.board = board;
        this.state = State.WAITING_FOR_USERS;
    }

    addPlayer(player: Player) {
        player.position = this.board.nextFreePosition();
        this.players.push(player);
    }

    removePlayer(userId: string) {
        this.players = this.players.filter(this.doesNotHaveId(userId));
    }

    private doesNotHaveId(userId: string) {
        return (player: Player) => player.userId !== userId;
    }
}