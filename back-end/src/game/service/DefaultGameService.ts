import {
    GameService,
    GameRepository,
    IdProvider,
    DTO,
    events,
    boardDefinition
} from '../contract'

import {
    ValidationError,
    GameNotFound, 
} from './../errors';

import {
    GameCreatedEvent,
    PlayerJoinedEvent
} from './../events';

import {
    Game, Player
} from './../model';

import { Board } from '../model/Board';
import PlayerLeftEvent from '../events/PlayerLeftEvent';
import CannotStartGame from '../errors/CannotStartGame';
import Context  from '../contract/Context';
import { contract } from '..';
import { EventDispatcher } from '../contract/Events';
import Movement from '../contract/dto/Movement';
import { GameState, GameList } from '../contract/dto/GameState';
import { GameNameDuplicated, ErrorType } from 'tr-common/events';

export class DefaultGameService implements GameService
{
    context: Context;
    gameRepository: GameRepository;
    idProvider: IdProvider;
    eventDispatcher: EventDispatcher;

    constructor(context: Context) {
        this.context = context;
        this.gameRepository = context.repository;
        this.idProvider = context.idProvider;
        this.eventDispatcher = context.eventDispatcher;
    }

    gameState(gameId: string): GameState {
        return this.gameRepository.findById(gameId).getState();    
    }

    gameList(): GameList {
        return {
            games: this.gameRepository.findAll().map(game => {
                return {
                    gameId: game.id,
                    gameName: game.name
                }
            })
        }
    }

    createGame(data: DTO.CreateGame, board: boardDefinition[][]): void {

        if (data.gameName == "") {
            throw new ValidationError(ErrorType.FIELD_REQUIRED, "gameName");
        }

        if (this.gameRepository.hasGameWithName(data.gameName)) {
            throw this.gameDuplicated(data.gameName);
        }

        const newGame = new Game(
            this.idProvider.newId(),
            data.gameName,
            new Board(board)
        )

        this.gameRepository.add(newGame)
        this.eventDispatcher.dispatch(new GameCreatedEvent(newGame));
    }

    private gameDuplicated(name: string): GameNameDuplicated {
        return {
            isError: true,
            type: ErrorType.FIELD_NOT_UNIQUE,
            origin: undefined,
            message: "Game with this name already exists.",
            gameName: name
        }
    }

    addPlayer(addPlayerRequest: DTO.PlayerData) {
        const game = this.gameRepository.findById(addPlayerRequest.gameId);
        
        if (!game) {
            throw new GameNotFound(addPlayerRequest.gameId);
        }

        const player = new Player(
            addPlayerRequest.userId,
            addPlayerRequest.userName
        );

        game.addPlayer(player);

        this.gameRepository.persist(game);
        this.eventDispatcher.dispatch(new PlayerJoinedEvent(player, game.id))
    }

    removePlayer(removePlayer: DTO.PlayerData): void {
        const game = this.gameRepository.findById(removePlayer.gameId);

        if (!game) {
            throw new GameNotFound(removePlayer.gameId);
        }

        game.removePlayer(removePlayer.userId);

        this.gameRepository.persist(game);
        this.eventDispatcher.dispatch(new PlayerLeftEvent(removePlayer.userId, game.id));
    }

    startRequest(player: DTO.PlayerData): void {
        try {
            const game = this.getGame(player.gameId);
            game.startRequest(player.userId, this.context);
            this.gameRepository.persist(game);
        } catch (gameError) {
            throw new CannotStartGame(gameError);
        }
    }

    executeMovement(movement: Movement): void {
        const game = this.getGame(movement.gameId);
        game.movment(movement, this.context);

        this.gameRepository.persist(game);
    }

    private getGame(gameId: string): Game {
        const game = this.gameRepository.findById(gameId);

        if (!game) {
            throw new GameNotFound(gameId);
        }

        return game;
    }
}