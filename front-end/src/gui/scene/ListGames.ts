import Phaser from 'phaser';
import { GameController } from '../../GameController';
import { GameInfo } from 'tr-common';
const addGameForm = require('../../../assets/form/add_game.html.template');

const MAX_GAMES_DISPLAYED = 10;

class GameSlot {
    text: Phaser.GameObjects.Text;
    gameId: string;

    constructor(text: Phaser.GameObjects.Text) {
        this.text = text;
    }
}

export class ListGames extends Phaser.Scene
{
    gameSlots: GameSlot[] = [];
    controller: GameController;

    init(controller: GameController) {
        this.controller = controller;
    }

    preload() {
        this.load.html('add_game', addGameForm);
    }

    create() {
        this.createSlots();
        const controller = this.controller;
        const html = this.add.dom(400, 50).createFromCache('add_game');
        html.addListener('click');
        html.on('click', function (event: any) {
            if (event.target.name !== 'add') {
                return;
            }

            const gameInput = this.getChildByName('game-name');
            controller.addGame(gameInput.value);
        })
    }

    createSlots() {
        let y = 100;
        const x = 20;
        const hegiht = 40;
        const textConfig = {
            fontFamily: 'Verdana, "Times New Roman", Tahoma, serif',
            fontSize: 40
        }

        for (let i = 0; i < MAX_GAMES_DISPLAYED; i++) {
            const gameText = this.add.text(x, y, "", textConfig);

            gameText.setInteractive();
            gameText.on('pointerover', () => gameText.setFill("#FF0000"));
            gameText.on('pointerout', () => gameText.setFill('#FFFFFF'));
            gameText.on('pointerdown', () => {
                const gameId = this.gameSlots[i].gameId;
                this.controller.join(gameId);
            })

            this.gameSlots.push(new GameSlot(gameText));
            y += hegiht;
        }
    }

    update() {
        const games = this.controller.state.games;

        for (let i = 0; i < MAX_GAMES_DISPLAYED; i++) {
            const slot = this.gameSlots[i];
            const game = games[i];

            if (!game) {
                continue;
            }
            
            slot.gameId = game.id;
            slot.text.text = game.name;
        }
    }
}