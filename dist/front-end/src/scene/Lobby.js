"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const common_1 = require("../../../common");
const Client_1 = require("../../src/client/Client");
const consts_1 = require("./consts");
const InputText_1 = require("../ui/InputText");
const bg = require('../../assets/img/background.png');
const TEXT_WIDTH = 700;
const TEXT_HEIGHT = 50;
const GAMES_ON_PAGE = 10;
const TEXT_STYLE = Object.assign(Object.assign({}, consts_1.COMMON_TEXT_STYLE), { fixedWidth: TEXT_WIDTH, fixedHeight: TEXT_HEIGHT });
class Lobby extends phaser_1.default.Scene {
    constructor() {
        super(...arguments);
        this.createdGames = [];
        this.backend = Client_1.Client.get();
        this.gameDisplays = [];
    }
    init(data) {
        this.createdGames = data.games.reverse();
        this.userId = data.userId;
        const onGameCreated = (event) => {
            this.createdGames.unshift({ id: event.gameId, name: event.gameName });
        };
        this.backend.on(common_1.EventType.GAME_CREATED, onGameCreated);
        this.backend.on(common_1.EventType.GAME_REMOVED, (event) => {
            this.createdGames = this.createdGames.filter((game) => game.id !== event.gameId);
            console.info(this.createdGames);
        });
    }
    preload() {
        this.load.image("background", bg);
    }
    create() {
        this.add.image(consts_1.CENTER_X, consts_1.CENTER_Y, "background");
        this.createGameNameInput();
        this.createGameAddButton();
        this.createGameList();
    }
    createGameNameInput() {
        const config = {
            x: 10,
            y: 10,
            maxChars: 20
        };
        const style = Object.assign({ fixedWidth: 600, fixedHeight: 50 }, consts_1.INPUT_STYLE);
        this.gameName = new InputText_1.TextInput(this, config, style, "Dodaj grę...");
    }
    createGameAddButton() {
        const buttonStyle = Object.assign(Object.assign({}, consts_1.COMMON_TEXT_STYLE), { backgroundColor: '#FF0000', color: '#FFFFFF', fixedWidth: 160, fixedHeight: 50 });
        const button = this.add.text(615, 10, "DODAJ", buttonStyle);
        button.setAlign("center");
        button.setInteractive();
        button.on('pointerover', () => button.setAlpha(0.7));
        button.on('pointerout', () => button.clearAlpha());
        button.on('pointerdown', () => this.addGame());
    }
    addGame() {
        const command = {
            type: common_1.CommandType.CREATE_GAME,
            gameName: this.gameName.value()
        };
        this.backend.send(command);
    }
    createGameList() {
        let i = 0;
        while (i < GAMES_ON_PAGE) {
            this.createGameText(i++);
        }
    }
    createGameText(no) {
        const display = this.add.text(consts_1.CENTER_X - (TEXT_WIDTH / 2), 90 + (no) * TEXT_HEIGHT, "", TEXT_STYLE);
        display.setInteractive();
        display.setBackgroundColor('#FFFFFF');
        display.setColor('#000000');
        display.setAlpha(0.7);
        display.on('pointerover', () => display.clearAlpha());
        display.on('pointerout', () => display.setAlpha(0.7));
        display.on('pointerdown', () => this.joinGame(no));
        this.gameDisplays.push({
            gameId: null,
            display
        });
    }
    joinGame(no) {
        const gameDisplay = this.gameDisplays[no];
        if (!gameDisplay.gameId) {
            return;
        }
        const onGameJoined = (event) => {
            this.scene.stop();
            this.scene.start("game", {
                state: event.currentState,
                userId: this.userId
            });
        };
        this.backend.on(common_1.EventType.GAME_JOINED, onGameJoined);
        const command = {
            type: common_1.CommandType.JOIN_GAME,
            gameId: gameDisplay.gameId
        };
        this.backend.send(command);
    }
    update() {
        for (let gameDisplay of this.gameDisplays) {
            gameDisplay.display.text = "";
            gameDisplay.gameId = undefined;
        }
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
exports.Lobby = Lobby;
//# sourceMappingURL=Lobby.js.map