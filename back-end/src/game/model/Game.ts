import Player from "./Player";
import { Board } from "./Board";
import UserNotFound from "../errors/UserNotFound";
import GameStartedTwice from "../errors/GameStartedTwice";
import { EventDispatcher } from "../contract/Events";
import GameStartedEvent from "../events/GameStartedEvent";
import Context from "../contract/Context";
import Turn from "./Turn";
import { Movement } from "../contract/dto";
import GameNotStarted from "../errors/GameNotStarted";
import IncorrectPlayerAction from "../errors/IncorrectPlayerAction";
import { pathToFileURL } from "url";
import PlayerMoved from "../events/PlayerMoved";
import InvalidPath from "../errors/InvalidPath";

enum State {
    WAITING_FOR_USERS = "WAITING FOR PLAYERS",
    STARTED = "STARTED"
}

export default class Game 
{
    id: string
    name: string
    players: Array<Player> = [];
    state: string;
    board: Board
    gameStartRequests: Set<String> = new Set();
    currentTurn: Turn;

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

    startRequest(userId: string, env: Context) {
        this.assertPlayerExists(userId);

        if (this.gameStartRequests.has(userId)) {
            throw new GameStartedTwice(userId);
        }

        this.gameStartRequests.add(userId);

        if (this.shouldStart()) {
            this.start(env);
            env.eventDispatcher.dispatch(new GameStartedEvent(this.id, this.currentTurn));
        }
        
    }

    movment(movement: Movement, env: Context) {        
        if (this.state != State.STARTED) {
            throw new GameNotStarted(this.id);
        }

        if (this.currentTurn.userId != movement.userId) {
            throw new IncorrectPlayerAction(
                this.id,
                this.currentTurn.userId,
                movement.userId
            )
        }

        if (movement.path.length != this.currentTurn.stepPoints) {
            throw new InvalidPath();
        }

        this.board.validatePath(movement.path);
        const lastPosition = movement.path[movement.path.length - 1];
        const player = this.getPlayer(movement.userId);

        player.position = lastPosition;
        env.eventDispatcher.dispatch(new PlayerMoved(player, movement.path));
    }

    private shouldStart(): boolean {
        return this.players.length == this.gameStartRequests.size;
    }

    private start(env: Context) {
        this.state = State.STARTED;
        this.currentTurn = new Turn(this.players[0].userId, env.rnd);
    }

    private assertPlayerExists(userId: string) {
        if (!this.getPlayer(userId)) {
            throw new UserNotFound(userId);
        }
    }

    private getPlayer(userId: string): Player {
        return this.players.filter(this.withUserId(userId))[0];
    }

    private withUserId(userId: string) {
        return (player: Player) => player.userId == userId; 
    }

    private doesNotHaveId(userId: string) {
        return (player: Player) => player.userId !== userId;
    }
}