import Phaser from 'phaser';
import { CENTER_X, CENTER_Y } from './consts';
import { Game, Tile, TileType, Position, GameJoined, Player, PlayerJoined, CommandType, TurnStarted, Turn } from 'tr-common';
import { Client } from '../client/Client';
import { BoardScene } from './BoardScene';
import { Interface } from 'readline';
import { GUI } from './GUI';

const bg = require('../../assets/img/background.png');
const player = require('../../assets/img/player.png');
const spikes = require('../../assets/img/spikes.png');
const tile = require('../../assets/img/tile.png');
const wall = require('../../assets/img/wall.png');
const finish = require('../../assets/img/finish.png');

const TILE_SIZE = 32;
const BOARD_X = TILE_SIZE / 2;
const BOARD_Y = 50;

export class GameScene extends Phaser.Scene
{
    private backend: Client;
    private userId: string;
    private state: Game; 
    private board: BoardScene;
    graphics: Phaser.GameObjects.Graphics;

    init(data: {state: Game, userId: string})
    {
        this.state = data.state;
        this.userId = data.userId;
        this.backend = Client.get();
    }

    preload()
    {
        this.load.image("background", bg);
        this.load.image("player", player);
        this.load.spritesheet("spikes", spikes, {
            frameWidth: TILE_SIZE,
            frameHeight: TILE_SIZE
        });
        this.load.image("path", tile);
        this.load.image("wall", wall);
        this.load.image("finish", finish);
    }

    create()
    {
        this.add.image(CENTER_X, CENTER_Y, "background")
        this.setUpBoard();
        this.setUpInterface();
        this.setUpGraphics();
        this.setUpStartButton();
    }

    private setUpBoard()
    {
        const zone = this.add.zone(BOARD_X, BOARD_Y, 600, 600);
        const board = new BoardScene('board', zone);

        this.board = board;
        this.scene.add('board', board, true, {
            game: this.state,
            userId: this.userId
        });
    }

    private setUpInterface()
    {
        const zone = this.add.zone(600, BOARD_Y, 200, 550);
        const gui = new GUI('interface', zone);

        this.scene.add('interface', gui, true, {
            game: this.state,
            userId: this.userId
        });
    }

    private setUpGraphics()
    {
        this.graphics = this.add.graphics({
            fillStyle: {
                color: 0xFF0000,
                alpha: 1
            }
        })
    }   

    private setUpStartButton()
    {
        const graphics = this.add.graphics({
            fillStyle: {
                color: 0xFFFFFF,
                alpha: 0.7
            }
        })
        const rect = graphics.fillRect(0, 0, 800, 600);

        const text = "CLICK TO START";
        const startButton = this.add.text(0,0, text, {
            backgroundColor: '#FF0000',
            color: '#000000',
            fixedWidth: 400,
            fixedHeight: 50,
            align: "center",
            fontSize: '40px'
        })

        startButton.x = CENTER_X - startButton.width / 2;
        startButton.y = CENTER_Y - startButton.height / 2;
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            rect.destroy();
            startButton.destroy();
            graphics.destroy();
            this.requestGameStart();
        })
    }

    private requestGameStart()
    {
        this.backend.send({
            type: CommandType.START_GAME
        });
    }
}

