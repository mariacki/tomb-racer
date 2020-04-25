import Phaser from 'phaser';
import { CENTER_X, CENTER_Y } from './consts';
import { Game, Tile, TileType, Position, GameJoined, Player, PlayerJoined, CommandType, TurnStarted, Turn, EventType, GameFinished } from '../../../common';
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

const h1 = require('../../assets/img/hole1.png');
const h2 = require('../../assets/img/hole2.png');
const h3 = require('../../assets/img/hole3.png');
const h4 = require('../../assets/img/hole4.png');

const k1 = require('../../assets/img/key1.png');
const k2 = require('../../assets/img/key2.png');
const k3 = require('../../assets/img/key3.png');
const k4 = require('../../assets/img/key4.png');

const kill_all = require('../../assets/img/kill_all.png');

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

        this.load.image("k1", k1);
        this.load.image("k2", k2);
        this.load.image("k3", k3);
        this.load.image("k4", k4);

        this.load.image("h1", h1);
        this.load.image("h2", h2);
        this.load.image("h3", h3);
        this.load.image("h4", h4);
    }

    create()
    {
        this.add.image(CENTER_X, CENTER_Y, "background")
        this.setUpBoard();
        this.setUpInterface();
        this.setUpGraphics();
        this.setUpStartButton();

        this.backend.on(EventType.GAME_FINISHED, (event: GameFinished) => {
            const winner = this.state.players.filter((p) => p.userId == event.userId)[0];

            alert('The winner is ' + winner.userName);
        })
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
        alert('Naciśnij ok aby rozpocząć!');

        this.requestGameStart();
    }

    private requestGameStart()
    {
        this.backend.send({
            type: CommandType.START_GAME
        });
    }
}

