import Phaser from 'phaser';
import { CreateGame, GameInfo, GameCreated, Game, CommandType, JoinGame, GameJoined, EventType } from 'tr-common';
import { Client } from '../../src/client/Client';
import { CENTER_X, CENTER_Y, COMMON_TEXT_STYLE, INPUT_STYLE} from './consts';
import { TextInput, TextInputConfig } from '../ui/InputText';


const bg = require('../../assets/img/background.png');

const TEXT_WIDTH = 700;
const TEXT_HEIGHT = 50;
const GAMES_ON_PAGE = 10;

const TEXT_STYLE = {
    ...COMMON_TEXT_STYLE,
    fixedWidth: TEXT_WIDTH,
    fixedHeight: TEXT_HEIGHT
}

export class Lobby extends Phaser.Scene 
{
    private createdGames: GameInfo[] = [];
    private userId: string;
    private backend: Client = Client.get();

    private gameDisplays: {
        gameId: string,
        display: Phaser.GameObjects.Text
    }[] = [];

    private gameName: TextInput;
    
    init(data: {games: GameInfo[], userId: string})
    {
        this.createdGames = data.games.reverse();
        this.userId = data.userId;
        const onGameCreated = (event: GameCreated) => {
            this.createdGames.unshift({id: event.gameId, name: event.gameName}); 
        }

        this.backend.addEventListener(EventType.GAME_CREATED, onGameCreated)
    }

    preload()
    {
        this.load.image("background", bg);
    }

    create()
    {
        this.add.image(CENTER_X, CENTER_Y, "background");
        this.createGameNameInput();
        this.createGameAddButton();
        this.createGameList();
    }

    private createGameNameInput()
    {
        const config: TextInputConfig = {
            x: 10,
            y: 10,
            maxChars: 20
        }

        const style = {
            fixedWidth: 600,
            fixedHeight: 50,
            ...INPUT_STYLE
        }

        this.gameName = new TextInput(this, config, style, "Dodaj grę...");
    }

    private createGameAddButton()
    {
        const buttonStyle = {
            ...COMMON_TEXT_STYLE,
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            fixedWidth: 160,
            fixedHeight: 50
        }

        const button = this.add.text(615, 10, "DODAJ", buttonStyle);
        button.setAlign("center");
        button.setInteractive();
        button.on('pointerover', () => button.setAlpha(0.7));
        button.on('pointerout', () => button.clearAlpha());
        button.on('pointerdown', () => this.addGame())
    }

    private addGame()
    {
        const command: CreateGame = {
            type: CommandType.CREATE_GAME,
            gameName: this.gameName.value()
        }

        this.backend.send(command);
    }

    private createGameList()
    {
        let i = 0;
        while (i < GAMES_ON_PAGE) {
            this.createGameText(i++);
        }
    }

    private createGameText(no: number)
    {
        const display = this.add.text(CENTER_X - (TEXT_WIDTH / 2), 90 + (no) * TEXT_HEIGHT, "", TEXT_STYLE);

        display.setInteractive();
        display.setBackgroundColor('#FFFFFF');
        display.setColor('#000000')
        display.setAlpha(0.7)
        display.on('pointerover', () => display.clearAlpha())
        display.on('pointerout', () => display.setAlpha(0.7));
        display.on('pointerdown', () => this.joinGame(no))

        this.gameDisplays.push({
            gameId: null,
            display
        })
    }

    private joinGame(no: number) {
        const gameDisplay = this.gameDisplays[no];

        if (!gameDisplay.gameId) {
            return;
        }

        const onGameJoined = (event: GameJoined) => {
            this.scene.stop();
            this.scene.start("game", {
                state: event.currentState,
                userId: this.userId
            });
        }

        this.backend.addEventListener(EventType.GAME_JOINED, onGameJoined)

        const command: JoinGame = {
            type: CommandType.JOIN_GAME,
            gameId: gameDisplay.gameId
        }

        this.backend.send(command);
    }

    update()
    {
        let i = 0;
        while (i < Math.min(this.createdGames.length, GAMES_ON_PAGE)) {
            const game = this.createdGames[i];
            const gameDisplay = this.gameDisplays[i];

            gameDisplay.display.text = `${i + 1}. ${game.name}`;
            gameDisplay.gameId = game.id;  
            i++;
        }
    }
}