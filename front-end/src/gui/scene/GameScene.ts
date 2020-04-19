import Pahser from 'phaser';
import { GameController } from './../../GameController';
import { TileType, Position } from 'tr-common';

const spikes = require('./../../../assets/img/spikes.png');
const tile = require('./../../../assets/img/tile.png');
const wall = require('./../../../assets/img/wall.png');
const player = require('./../../../assets/img/player.png');
const bg = require('./../../../assets/img/background.png');

const TILE_SIZE = 32;
const BOARD_OFFSET_X = 16;
const BOARD_OFFSET_Y = 40;


interface PlayerObjects {
    text: Pahser.GameObjects.Text,
    sprite: Phaser.GameObjects.Sprite;
}

export class GameScene extends Phaser.Scene 
{
    gameController: GameController;

    players: Map<string, PlayerObjects> = new Map();

    currenltyPlaying: Phaser.GameObjects.Text;

    turnInfo: Phaser.GameObjects.Text;

    tiles: Phaser.GameObjects.Sprite[][] = [];

    lastAdjacents: Position[] = [];

    selectedPath: Position[] = [];

    isCurrentTurn: boolean = false;

    init(gameController) {
        this.gameController = gameController;
    }

    preload() {
        this.load.image('tile', tile);
        this.load.image('wall', wall);
        this.load.image('spikes', spikes);
        this.load.image('player', player);
        this.load.image('bg', bg);
    }

    create() {

        //set up background
        const bg = this.add.image(400, 300, "bg");

        //set up board;
        const board = this.gameController.state.game.board;
        const boardContainer = this.add.container(BOARD_OFFSET_X, BOARD_OFFSET_Y);
        const tileSize = 32;

        const tileTextures = new Map();
        tileTextures.set(TileType.WALL, "wall");
        tileTextures.set(TileType.STARTING_POINT, "tile");
        tileTextures.set(TileType.PATH, "tile");
        tileTextures.set(TileType.SPIKES, "spikes")

        for (let row = 0; row < board.length; row++) {
            const currentRow = []
            for (let col = 0; col < board[row].length; col++) {
                const spriteX = col * tileSize;
                const spriteY = row * tileSize;
                const tile = board[row][col];
                const texture = tileTextures.get(tile.type);

                const tileSprite = this.add.sprite(spriteX, spriteY, texture);
                boardContainer.add(tileSprite);
                
                currentRow.push(tileSprite);
            }
            this.tiles.push(currentRow);
        }
        

        //set up start game button
        if (!this.gameController.state.currentPlayer) {
        
            const startTextStyle = {
                fontFamily: 'Courier',
                backgroundColor: '#ff000',
                fontSize: 50,
            }

            const startButton = this.add.text(400, 300, "Rozpocznij", startTextStyle);
            startButton.setInteractive();

            startButton.x = startButton.x - (startButton.width / 2);
            startButton.y = startButton.y - (startButton.height / 2)

            startButton.on('pointerdown', () => {
                startButton.destroy();
                this.gameController.startGame();
            })

            //setup game info
        }

        this.turnInfo = this.add.text(10, 4, "Oczekiwanie na start gry");
    }

    update() {
        this.updateTurnInfo();
        this.updatePlayers();
    }

    private updateTurnInfo() {
        const currentPlayer = this.gameController.state.currentPlayer;
        if (!currentPlayer) {
            return;
        }
        
        const points = this.gameController.state.currentSetpPoints;
                
        const turnInfoText = `Teraz gra ${currentPlayer.userName}. Punkty kroków: ${points}. Zdrowie: ${currentPlayer.hp} %`;
        this.turnInfo.text = turnInfoText;
    }

    public enableMoves() {
        this.showAdjacents(this.gameController.state.currentPlayer.position);
    } 

    public disableMoves() {
        this.disableAdjacents(this.lastAdjacents);
    }

    public showAdjacents(position: Position) {

        const adjacents = [
            {row: position.row - 1, col: position.col },
            {row: position.row + 1, col: position.col },
            {row: position.row, col: position.col - 1},
            {row: position.row, col: position.col + 1}
        ]

        const isValid = (adjacent) => {
            const boardTiles = this.gameController.state.game.board;

            if ((adjacent.row < 0) || (adjacent.row >= boardTiles.length)) {
                return false;
            }

            if ((adjacent.col < 0) || (adjacent.col >= boardTiles[adjacent.row].length)) {
                return false;
            }

            const walkables = [TileType.FINISH_POINT, TileType.STARTING_POINT, TileType.SPIKES, TileType.PATH];

            return walkables.includes(boardTiles[adjacent.row][adjacent.col].type);
        }

        const validAdjacents = adjacents.filter(isValid);

        this.lastAdjacents = validAdjacents;

        for (let adjacent of validAdjacents) {
            const tileSprite = this.tiles[adjacent.row][adjacent.col];

            tileSprite.setInteractive();
            tileSprite.setTint(0xFF);
            tileSprite.addListener('pointerup', () => {
                this.selectedPath.push(adjacent);
                this.disableAdjacents(validAdjacents);
                
                this.gameController.state.currentPlayer.position = adjacent;
                this.gameController.state.currentSetpPoints -= 1;

                if (this.gameController.state.currentSetpPoints <= 0) {
                    this.gameController.movePlayer(this.selectedPath);
                    this.selectedPath = [];
                    return;
                }

                this.showAdjacents(adjacent);                
                tileSprite.setTint(0xFFFF00);
            });
            
        }
    }

    private disableAdjacents(adjacents) {
        for (let adjacent of adjacents) {
            const tileSprite = this.tiles[adjacent.row][adjacent.col];
            tileSprite.removeAllListeners();
            tileSprite.disableInteractive();
            tileSprite.clearTint();
        }
    }

    private updatePlayers() {
        const players = this.gameController.state.game.players;

        for (let player of players) {
            let playerObjects = this.players.get(player.userId);

            if (!playerObjects) {
                playerObjects = {
                    sprite: this.add.sprite(0, 0, 'player'),
                    text: this.add.text(0, 0, player.userName)
                }

                playerObjects.sprite.setScale(0.5, 0.5);
                this.players.set(player.userId, playerObjects);
            }

            const position = this.calculatePosition(player.position);

            playerObjects.sprite.x = position.x;
            playerObjects.sprite.y = position.y;

            playerObjects.text.x = position.x - (TILE_SIZE * 0.5);
            playerObjects.text.y = position.y - (TILE_SIZE * 0.5);
        }
    }

    private calculatePosition(boardPosition: Position): {x: number, y: number}
    {

        return {
            x: BOARD_OFFSET_X + boardPosition.col * TILE_SIZE,
            y: BOARD_OFFSET_Y + boardPosition.row * TILE_SIZE
        }
    }
}