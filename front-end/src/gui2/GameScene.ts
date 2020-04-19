import Phaser from 'phaser';
import { Position, Player as PlayerData } from 'tr-common';

const TILES_SIZE = 32;
const BOARD_OFFSET_X = 16;
const BOARD_OFFSET_Y = 40;

class ScreenPosition
{
    x: number;
    y: number;

    private constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    static fromBoard(position: Position)
    {
        const x = BOARD_OFFSET_X + position.col * TILES_SIZE;
        const y = BOARD_OFFSET_Y + position.row * TILES_SIZE;

        return new ScreenPosition(x, y);
    }
}   

class PlayerContainer
{
    container: Phaser.GameObjects.Container;

    constructor(container: Phaser.GameObjects.Container)
    {
        this.container = container;
    }
}

class PlayerFactory extends Phaser.GameObjects.GameObjectFactory
{
    createPlayer(player: PlayerData): PlayerContainer
    {
        const screen = ScreenPosition.fromBoard(player.position);
        const container = this.container(screen.x, screen.y);

        const playerText = this.text(TILES_SIZE * .5, TILES_SIZE * .5, player.userName);
        const playerSprite = this.sprite(0, 0, "player");
        
        container.add([playerSprite, playerText]);

        return new PlayerContainer(container);
    }
}

export class GameScene extends Phaser.Scene
{
    players: Map<string, PlayerContainer> = new Map();

    playerFactory: PlayerFactory = new PlayerFactory(this);

    addPlayer(player: PlayerData)
    {
        const container = this.playerFactory.createPlayer(player);
        this.players.set(player.userId, container);
    }

    removePlayer(userId: string)
    {
        this.players.delete(userId); 
    }
}