import { 
    Player, 
    Board, 
    GameTurn 
} from '.';

import { 
    NumberOfStartingPointsExceeded, 
    GameStartedTwice, 
    GameNotStarted, 
    IncorrectPlayerAction, 
    UserNotFound 
} from '../errors';

import { 
    TurnStartedEvent, 
    PlayerMovedEvent, 
    PlayerDiedEvent, 
    GameFinishedEvent, 
    PlayerJoinedEvent, 
    PlayerLeftEvent 
} from '../events';

import { Context, Movement, PlayerData } from '../contract';
import { Game as GameState, TileType, Event, Position } from '../../../../common';
import { PlayerFactory } from './PlayerFactory';
import { Path } from './Path';
import { PlayerCollection } from './PlayerCollection';

enum State {
    WAITING_FOR_USERS = "WAITING FOR PLAYERS",
    STARTED = "STARTED",
    FINISHED = "FINISHED"
}

export class Game 
{
    id: string
    name: string
    players: PlayerCollection = new PlayerCollection();
    state: string;
    board: Board
    gameStartRequests: Set<String> = new Set();
    currentTurn: GameTurn;
    currentPlayerIdx = -1;

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

    addPlayer(playerData: PlayerData): Event[] 
    {
        this.assertStartingPointsLeft();
        const playerPosition = this.board.reserveStartingPoint();
        const player = PlayerFactory.create(playerData, playerPosition);
        this.players.push(player);

        return [new PlayerJoinedEvent(this.id, player)]        
    }

    private assertStartingPointsLeft()
    {
        if (!this.board.hasFreeStartingPoints())
        {
            throw new NumberOfStartingPointsExceeded(
                this.board.numberOfStartingPoints(), 
                this.id
            )
        }
    }

    removePlayer(userId: string): Event[]
    {
        const removedPlayer = this.players.getByUserId(userId);
        
        this.players.removeHavingId(userId);  
        this.board.freeStartingPoint(removedPlayer.startedOn);
        
        return [new PlayerLeftEvent(userId, this.id)]
    }

    isCurrentlyPlaying(userId: string): boolean
    {
        if (this.state !== State.STARTED) return false;

        return this
            .currentTurn
            .currentlyPlaying === userId;
    }

    hasPlayers(): boolean
    {
        return this.players.size() > 0;
    }

    addStartRequest(userId: string)
    {
        this.assertPlayerExists(userId);
        this.assertNoStartRequestFrom(userId);

        this.gameStartRequests.add(userId);
    }

    isReadyToStart(): boolean
    {
        if (this.state === State.STARTED) return;

        return this.gameStartRequests.size === this.players.size();
    }

    start(diceRoll: number): Event[]
    {
        this.state = State.STARTED;
        return this.startNextTurn(diceRoll);
    }

    startNextTurn(diceRoll: number): Event[]
    {        
        const player = this.nextPlayer();
        this.currentTurn = new GameTurn(player.userId, diceRoll)
        
        return [new TurnStartedEvent(this.id, this.currentTurn)];
    }

    private nextPlayer(): Player
    {        
        const shouldRewind = ++this.currentPlayerIdx == this.players.size();
        this.currentPlayerIdx = shouldRewind ? 0 : this.currentPlayerIdx;

        return this.players.getByIndex(this.currentPlayerIdx);
    }
        
    private assertNoStartRequestFrom(userId: string)
    {
        if (this.gameStartRequests.has(userId))
        {
            throw new GameStartedTwice(userId, this.id); 
        }
    }

    getState(): GameState {
       return {
           id: this.id,
           name: this.name,
           players: this.players.getAll(),
           currentTurn: this.currentTurn ? this.currentTurn : {},
           board: this.board.toTileList()
       }
    }
    
    executeMovement(movement: Movement, env: Context): Event[]
    {    
        this.assertGameStarted();
        this.assertCurrentTurn(movement);

        const events: Event[] = [];
        const player = this.players.getByUserId(movement.userId);
        const length = this.currentTurn.stepPoints;
        const path = new Path(movement.path, this.board, length);

        
        
        events.push(...path.executeWalk(player, this));
        
        if (player.hadDied()) {
            player.restore();
            return [...events, new PlayerDiedEvent(this.id, player)]
        } 

        events.push(new PlayerMovedEvent(this.id, player.userId, movement.path));

        return events;
    }

    canBeFinished(): boolean
    {
        const lastPlayerPosition = this.players.getByIndex(this.currentPlayerIdx).position;
        const tile = this.board.getTile(lastPlayerPosition);

        return tile.type === TileType.FINISH_POINT;
    }

    finish(): Event[]
    {
        this.state = State.FINISHED;
        const winner = this.players.getByIndex(this.currentPlayerIdx);

        return [new GameFinishedEvent(this.id, winner.userId)]
    }

    private assertGameStarted() 
    {
        if (this.state != State.STARTED) {
            throw new GameNotStarted(this.id);
        }
    }

    private assertCurrentTurn(movement: Movement)
    {
        if (this.currentTurn.currentlyPlaying != movement.userId) {
            throw new IncorrectPlayerAction(
                this.id,
                movement.userId,
                this.currentTurn.currentlyPlaying,
            )
        }
    }

    private assertPlayerExists(userId: string)
    {
        if (!this.players.has(userId)) {
            throw new UserNotFound(userId);
        }
    }
}