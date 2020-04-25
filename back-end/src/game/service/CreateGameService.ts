import { GameRepository, CreateGame, IdProvider } from "../contract";
import { BoardDefinition, Game, Board } from "../model";
import { ValidationError } from "../errors";
import { GameNameDuplicated, ErrorType } from "../../../../common";
import { EventDispatcher } from "../contract";
import { GameCreatedEvent } from "../events";
import { RepositoryService } from "./RepositoryService";

export class CreateGameService extends RepositoryService
{
    idProvider: IdProvider
    event: EventDispatcher

    constructor(
        gameRepository: GameRepository,
        idProvider: IdProvider,
        event: EventDispatcher,
    ) {
        super(gameRepository);
        this.idProvider = idProvider;
        this.event = event;
    }

    createGame(data: CreateGame, boardDefinition: BoardDefinition[][]): string
    {
        this.assertValidData(data);
        
        const game = new Game(
            this.idProvider.newId(),
            data.gameName,
            new Board(boardDefinition)
        );

        super.persistGame(game);
        this.event.dispatch(new GameCreatedEvent(game));
        
        return game.id;
    }

    private assertValidData(data: CreateGame)
    {
        console.log(this.gameRepository);
        if (data.gameName == "") {
            throw new ValidationError(ErrorType.FIELD_REQUIRED, "gameName");
        }

        if (this.gameRepository.hasGameWithName(data.gameName)) {
            throw this.gameDuplicated(data.gameName);
        }
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
}