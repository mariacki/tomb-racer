import { Player, Board, GameTurn } from '.';
import { NumberOfStartingPointsExceeded, GameStartedTwice, GameNotStarted, IncorrectPlayerAction, InvalidPath, UserNotFound } from '../errors';
import { TurnStartedEvent, PlayerMovedEvent, PlayerDiedEvent, GameFinishedEvent } from '../events';
import { Context, Movement, randomize  } from '../contract';
import { Game as GameState, TileType } from 'tr-common';
import { TilePosition, Tile } from './tile';

enum State {
    WAITING_FOR_USERS = "WAITING FOR PLAYERS",
    STARTED = "STARTED",
    FINISHED = "FINISHED"
}

export class Game 
{
    id: string
    name: string
    players: Array<Player> = [];
    state: string;
    board: Board
    gameStartRequests: Set<String> = new Set();
    currentTurn: GameTurn;
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
        if (!this.board.hasFreePositions()) {
            throw new NumberOfStartingPointsExceeded(
                this.board.startingPoints.length, 
                this.id
            );
        }

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
            throw new GameStartedTwice(userId, this.id);
        }

        this.gameStartRequests.add(userId);

        if (this.shouldStart()) {
            this.start(env);
            env.eventDispatcher.dispatch(new TurnStartedEvent(this.id, this.currentTurn));
        }
    }

    getState(): GameState {
       return {
           id: this.id,
           name: this.name,
           players: this.players,
           currentTurn: this.currentTurn ? this.currentTurn : {},
           board: this.board.toTileList()
       }
    }
    
    

    movment(movement: Movement, env: Context) {    
        this.assertGameStarted();
        this.assertCurrentTurn(movement);

        const path = movement.path.map(position => TilePosition.fromDto(position))

        this.assertValidPath(path);
        const lastPosition = path[movement.path.length - 1];
        const player = this.getPlayer(movement.userId);

        this.board.getTilesOfPath(movement.path).forEach((tile: Tile) => {
            tile.onWalkThrough(player, env, this);
        });
        
        
        if (player.hp <= 0) {
            player.position = player.startedOn;
            player.hp = 100;
            env.eventDispatcher.dispatch(new PlayerDiedEvent(this.id, player))
        } else {
            player.position = lastPosition;
            env.eventDispatcher.dispatch(new PlayerMovedEvent(this.id, player.userId, movement.path));

            if (this.board.tiles[lastPosition.row][lastPosition.col].type == TileType.FINISH_POINT) {
                this.state = State.FINISHED;
                env.eventDispatcher.dispatch(new GameFinishedEvent(this.id, player.userId));
                return;
            }
        }

        this.nextTurn(env);
    }

    private nextTurn(env: Context) {
        this.currentPlayerIdx++;
        if (this.currentPlayerIdx == this.players.length) {
            this.currentPlayerIdx = 0;
        }        
        this.currentTurn = new GameTurn(this.players[this.currentPlayerIdx].userId, env.rnd)
        env.eventDispatcher.dispatch(new TurnStartedEvent(this.id, this.currentTurn));
    }

    private assertGameStarted() {
        if (this.state != State.STARTED) {
            throw new GameNotStarted(this.id);
        }
    }

    private assertCurrentTurn(movement: Movement) {
        if (this.currentTurn.currentlyPlaying != movement.userId) {
            throw new IncorrectPlayerAction(
                this.id,
                movement.userId,
                this.currentTurn.currentlyPlaying,
            )
        }
    }

    private assertValidPath(path: TilePosition[]) {
        const result = this.board.validatePath(
            path, 
            this.players[this.currentPlayerIdx].position,
            this.currentTurn.stepPoints
        );

        if (!result.isValid) {
            throw new InvalidPath(this.id, result.invalidPath, result.message);
        }
    }

    private shouldStart(): boolean {
        return this.players.length == this.gameStartRequests.size;
    }

    private start(env: Context) {
        this.state = State.STARTED;
        this.currentTurn = new GameTurn(this.players[0].userId, env.rnd);
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