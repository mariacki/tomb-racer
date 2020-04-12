import Player from "./Player";
import { Board } from "./Board";
import UserNotFound from "../errors/UserNotFound";
import GameStartedTwice from "../errors/GameStartedTwice";
import GameStartedEvent from "../events/GameStartedEvent";
import Context from "../contract/Context";
import Turn from "./Turn";
import { Movement, Position } from "../contract/dto";
import GameNotStarted from "../errors/GameNotStarted";
import IncorrectPlayerAction from "../errors/IncorrectPlayerAction";
import PlayerMoved from "../events/PlayerMoved";
import { Tile, TileType } from "./tile/Tile";
import { randomize } from "../contract";
import NextTurn from "../events/NextTurn";
import PlayerDied from "../events/PlayerDied";
import GameFinished from "../events/GameFinished";

enum State {
    WAITING_FOR_USERS = "WAITING FOR PLAYERS",
    STARTED = "STARTED",
    FINISHED = "FINISHED"
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
    currentPlayerIdx = 0;

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
        player.startedOn = player.position;
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
        this.assertGameStarted();
        this.assertCurrentTurn(movement);
        this.assertValidPath(movement.path);
        const lastPosition = movement.path[movement.path.length - 1];
        const player = this.getPlayer(movement.userId);

        this.board.getTilesOfPath(movement.path).forEach((tile: Tile) => {
            tile.onWalkThrough(player, this.board, env);
        });

        /**
         * That is exactly what happens when you are tired. 
         */
        if (player.hp <= 0) {
            player.position = player.startedOn;
            player.hp = 100;
            env.eventDispatcher.dispatch(new PlayerDied(this.id, player))
        } else {
            player.position = lastPosition;
            env.eventDispatcher.dispatch(new PlayerMoved(this.id, player, movement.path));

            if (this.board.tiles[lastPosition.row][lastPosition.col].type == TileType.FINISH_POINT) {
                this.state = State.FINISHED;
                env.eventDispatcher.dispatch(new GameFinished(this.id, player));
                return;
            }
        }

        this.nextTurn(env.rnd);
        env.eventDispatcher.dispatch(new NextTurn(this.id, this.currentTurn));
    }

    private nextTurn(rnd: randomize) {
        this.currentPlayerIdx++;
        this.currentTurn = new Turn(this.players[this.currentPlayerIdx].userId, rnd)
    }

    private assertGameStarted() {
        if (this.state != State.STARTED) {
            throw new GameNotStarted(this.id);
        }
    }

    private assertCurrentTurn(movement: Movement) {
        if (this.currentTurn.userId != movement.userId) {
            throw new IncorrectPlayerAction(
                this.id,
                this.currentTurn.userId,
                movement.userId
            )
        }
    }

    private assertValidPath(path: Position[]) {
        this.board.validatePath(
            path, 
            this.players[this.currentPlayerIdx].position,
            this.currentTurn.stepPoints
        );
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