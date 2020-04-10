import { GameService } from '../contract/GameService';
import CreateGame from '../contract/dto/CreateGame';
import { GameRepository } from '../contract/GameRepository';
import { IdProvider } from '../contract/IdProvider';
import { Game } from '../model/Game';
import { contract } from '..';
import { AddPlayer } from '../contract/dto';
import Player from '../model/Player';

enum ErrorType {
    FIELD_REQUIRED = "FIELD REQUIRED",
    FIELD_NOT_UNIQUE = "FIELD NOT UNIQUE",
    GAME_NOT_FOUND = "GAME NOT FOUND"
}

class GameError extends Error
{
    type: ErrorType;

    constructor(type: ErrorType, message: string = "") {
        super(message);
        this.type = type;
    }
}

class ValidationError extends GameError
{
    field: string;
    
    constructor(type: ErrorType, field: string, message: string = "")
    {
        super(type, message);
        this.type = type;
        this.field = field;
    }
}

class GameNotFoundError extends GameError
{
    gameId: string;

    constructor(gameId: string) {
        super(ErrorType.GAME_NOT_FOUND)
        this.gameId = gameId;
    }
}

class GameCreatedEvent extends contract.events.Event
{
    constructor(game: Game) {
        super(
            contract.events.EventType.GAME_CREATED,
            {
                gameId: game.id,
                gameName: game.name,
                numberOfPlayers: game.players.length
            }
        )
    }
}

export class DefaultGameService implements GameService
{
    gameRepository: GameRepository;
    idProvider: IdProvider
    eventDispatcher: contract.events.EventDispatcher;

    constructor(
        gameRepository: GameRepository,
        idProvider: IdProvider,
        eventsDispatcher: contract.events.EventDispatcher
    ) {
        this.gameRepository = gameRepository;
        this.idProvider = idProvider;
        this.eventDispatcher = eventsDispatcher;
    }

    createGame(data: CreateGame, board: []): void {

        if (data.gameName == "") {
            throw new ValidationError(ErrorType.FIELD_REQUIRED, "gameName");
        }

        if (this.gameRepository.hasGameWithName(data.gameName)) {
            throw new ValidationError(ErrorType.FIELD_NOT_UNIQUE, "gameName");
        }

        const newGame = new Game(
            this.idProvider.newId(),
            data.gameName
        )

        this.gameRepository.add(newGame)
        
        this.eventDispatcher.dispatch(new GameCreatedEvent(newGame));
    }

    addPlayer(addPlayerRequest: AddPlayer) {
        const game = this.gameRepository.findById(addPlayerRequest.gameId);
        
        if (!game) {
            throw new GameNotFoundError(addPlayerRequest.gameId);
        }
        
        const player = new Player();

        player.userId = addPlayerRequest.userId;
        player.userName = addPlayerRequest.userName;

        game.players.push(player);

        this.gameRepository.persist(game);
    }
}