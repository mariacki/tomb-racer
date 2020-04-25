"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const consts_1 = require("./consts");
const common_1 = require("../../../common");
const Client_1 = require("../client/Client");
const BoardScene_1 = require("./BoardScene");
const GUI_1 = require("./GUI");
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
class GameScene extends phaser_1.default.Scene {
    init(data) {
        this.state = data.state;
        this.userId = data.userId;
        this.backend = Client_1.Client.get();
    }
    preload() {
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
    create() {
        this.add.image(consts_1.CENTER_X, consts_1.CENTER_Y, "background");
        this.setUpBoard();
        this.setUpInterface();
        this.setUpGraphics();
        this.setUpStartButton();
        this.backend.on(common_1.EventType.GAME_FINISHED, (event) => {
            const winner = this.state.players.filter((p) => p.userId == event.userId)[0];
            alert('The winner is ' + winner.userName);
        });
    }
    setUpBoard() {
        const zone = this.add.zone(BOARD_X, BOARD_Y, 600, 600);
        const board = new BoardScene_1.BoardScene('board', zone);
        this.board = board;
        this.scene.add('board', board, true, {
            game: this.state,
            userId: this.userId
        });
    }
    setUpInterface() {
        const zone = this.add.zone(600, BOARD_Y, 200, 550);
        const gui = new GUI_1.GUI('interface', zone);
        this.scene.add('interface', gui, true, {
            game: this.state,
            userId: this.userId
        });
    }
    setUpGraphics() {
        this.graphics = this.add.graphics({
            fillStyle: {
                color: 0xFF0000,
                alpha: 1
            }
        });
    }
    setUpStartButton() {
        alert('Naciśnij ok aby rozpocząć!');
        this.requestGameStart();
    }
    requestGameStart() {
        this.backend.send({
            type: common_1.CommandType.START_GAME
        });
    }
}
exports.GameScene = GameScene;
//# sourceMappingURL=GameScene.js.map