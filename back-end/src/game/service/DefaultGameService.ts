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
    ErrorType,
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

export class DefaultGameService implements GameService
{
    gameRepository: GameRepository;
    idProvider: IdProvider
    eventDispatcher: events.EventDispatcher;

    constructor(
        gameRepository: GameRepository,
        idProvider: IdProvider,
        eventsDispatcher: events.EventDispatcher
    ) {
        this.gameRepository = gameRepository;
        this.idProvider = idProvider;
        this.eventDispatcher = eventsDispatcher;
    }

    createGame(data: DTO.CreateGame, board: boardDefinition[][]): void {

        if (data.gameName == "") {
            throw new ValidationError(ErrorType.FIELD_REQUIRED, "gameName");
        }

        if (this.gameRepository.hasGameWithName(data.gameName)) {
            throw new ValidationError(ErrorType.FIELD_NOT_UNIQUE, "gameName");
        }

        const newGame = new Game(
            this.idProvider.newId(),
            data.gameName,
            new Board(board)
        )

        this.gameRepository.add(newGame)
        this.eventDispatcher.dispatch(new GameCreatedEvent(newGame));
    }

    addPlayer(addPlayerRequest: DTO.AddPlayer) {
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

    removePlayer(removePlayer: DTO.AddPlayer): void {
        const game = this.gameRepository.findById(removePlayer.gameId);

        if (!game) {
            throw new GameNotFound(removePlayer.gameId);
        }

        game.removePlayer(removePlayer.userId);

        this.gameRepository.persist(game);
        this.eventDispatcher.dispatch(new PlayerLeftEvent(removePlayer.userId));
    }

    startRequest(player: DTO.AddPlayer): void {
        const game = this.getGame(player.gameId);
    }

    private getGame(gameId: string) {
        const game = this.gameRepository.findById(gameId);

        if (!game) {
            throw new GameNotFound(gameId);
        }
    }
}