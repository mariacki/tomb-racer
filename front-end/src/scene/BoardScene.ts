import Phaser from 'phaser';
import { Position, TileType, Tile, Game, Player, PlayerJoined, EventType, TurnStarted } from 'tr-common';
import { Client } from '../client/Client';

export const TILE_SIZE = 32;

export interface State
{
    game: Game;
    userId: string;
}

export class BoardScene extends Phaser.Scene
{
    private backend: Client = Client.get();
    private board: BoardTiles;
    private parent: Phaser.GameObjects.Zone;
    private state: State;
    private players: Map<string, PlayerSprite> = new Map();

    constructor(handle: string, parent: Phaser.GameObjects.Zone)
    {
        super(handle);
        this.parent = parent;
    }

    init(state: State)
    {
        this.state = state;
    }

    create()
    {
        this.createBoard();
        this.setUpPlayerSprites();
        this.setUpEvents();
    }

    addPlayer(player: Player)
    {
        this.addPlayerSprite(player, this.players.size);
    }

    private createBoard()
    {
        this.board = new BoardTiles(
            this, 
            this.state.game.board, 
            this.parent.x, 
            this.parent.y,
            TILE_SIZE
        );        
    }

    private setUpPlayerSprites()
    {
        this.state.game.players.map((player, index) => this.addPlayerSprite(player, index))
    }

    private addPlayerSprite(player: Player, index: number)
    {
        const sprite = new PlayerSprite(
            this, 
            player,
            this.parent.x,
            this.parent.y,
            TILE_SIZE,
            index+1,
            "player"
        )

        this.players.set(player.userId, sprite);
    }

    private setUpEvents()
    {
        const onPlayerJoined = (event: PlayerJoined) => this.onPlayerJoined(event);
        this.backend.addEventListener(EventType.PLAYER_JOINED, onPlayerJoined);

        const onNextTurn = (event: TurnStarted) => this.onTurnStarted(event);
        this.backend.addEventListener(EventType.NEXT_TURN, onNextTurn);        
    }

    private onPlayerJoined(event: PlayerJoined)
    {
        if (this.state.userId === event.player.userId) return;
        this.addPlayerSprite(event.player, this.players.size);
    } 

    private onTurnStarted(event: TurnStarted)
    {
        if (this.state.userId === event.turn.currentlyPlaying) {
            const player = this.players.get(event.turn.currentlyPlaying);
            this.board.activatePathSelection(player.getBoardPosition(), event.turn.stepPoints);
        }
    }
}

class PathElement
{
    readonly position: Position;
    readonly dot: Phaser.GameObjects.Graphics;

    constructor(
        graphics: Phaser.GameObjects.Graphics,
        position: Position,
        boardX: number,
        boardY: number,
        size: number
    ) {
        const dotX = boardX + position.col * size;
        const dotY = boardY + position.row * size;

        this.dot = graphics.fillCircle(dotX, dotY, 10);
        this.dot.depth = 1000;
        this.position = position;
    }
}

class BoardTiles
{
    private tiles: Tile[][] = [];
    private tileSprites: Phaser.GameObjects.Sprite[][] = [];
    private currentPath: PathElement[] = []
    private currentAdjacents: Position[];
    private x: number;
    private y: number;
    private tileSize: number;
    private scene: Phaser.Scene;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(
        scene: Phaser.Scene,
        tiles: Tile[][],
        x: number,
        y: number,
        tileSize: number
    ) {
        this.x = x;
        this.y = y;
        this.tiles = tiles;
        this.scene = scene;
        this.tileSize = tileSize;
        this.setUpGraphics(scene);
        this.createTileSrpites(scene);
    }

    private setUpGraphics(scene: Phaser.Scene)
    {
        this.graphics = scene.add.graphics({
            fillStyle: {
                color: 0xFF0000,
                alpha: 1
            }
        })
    }

    private createTileSrpites(scene: Phaser.Scene)
    {
        const tiles = this.tiles;
        
        scene.anims.create({
            key: "default",
            frames: scene.anims.generateFrameNumbers('spikes', { start: 0, end: 21, }),
            frameRate: 20,
            repeat: -1
        })

        const textures: Map<TileType, string> = new Map([
            [TileType.FINISH_POINT, ""],
            [TileType.PATH, "path"],
            [TileType.SPIKES, "spikes"],
            [TileType.STARTING_POINT, "path"],
            [TileType.WALL, "wall"]
        ])

        for (let i = 0; i < tiles.length; i++) {
            const sprites = [];

            for (let j = 0; j < tiles[i].length; j++) {
                const x = this.x + j * this.tileSize;
                const y = this.y + i * this.tileSize;
                const texture = textures.get(tiles[i][j].type)
                const sprite = scene.add.sprite(x, y, texture);

                if (texture === "spikes") {
                    sprite.anims.play('default');
                }
                
                sprites.push(sprite);                
            }

            this.tileSprites.push(sprites);
        }
    }

    public activatePathSelection(position: Position, moves: number)
    {
        this.currentAdjacents = this.findValidAdjacentsOf(position);

        for (let adjacent of this.currentAdjacents) {
            this.enableClicks(adjacent, moves);
        }
    }

    private findValidAdjacentsOf(position: Position)
    {
        const proposals = [
            { row: position.row, col: position.col - 1},
            { row: position.row, col: position.col + 1},

            { row: position.row - 1, col: position.col},
            { row: position.row + 1, col: position.col}
        ]

        return proposals.filter(position => this.isValid(position))
    }

    private isValid(position: Position): boolean
    {
        const boardHeight = this.tiles.length;

        const exists = (
            (position.row >= 0) &&
            (position.row < boardHeight) &&
            (position.col >= 0) &&
            (position.col < this.tiles[position.row].length)
        )

        return exists && this.isWalkable(position);
    }

    private isWalkable(position: Position): boolean
    {
        const tile = this.tiles[position.row][position.col];
        const walkables = [
            TileType.FINISH_POINT,
            TileType.PATH,
            TileType.SPIKES,
            TileType.STARTING_POINT
        ]

        return walkables.includes(tile.type);
    }

    private enableClicks(position: Position, moves: number)
    {
        const tileSprite = this.tileSprites[position.row][position.col];
    
        tileSprite.setTint(0x00FF00);
        tileSprite.setInteractive();
        tileSprite.on('pointerover', () => tileSprite.setAlpha(0.8))
        tileSprite.on('pointerout', () => tileSprite.clearAlpha());
        tileSprite.on('pointerdown', () => this.selectPathElement(position, moves))
    }

    private selectPathElement(position: Position, moves: number)
    {
        this.clearCurrentAdjacents();

        moves -= 1;
        this.scene.events.emit('path-elem-selected', moves);

        if (moves === 0) {
            this.scene.events.emit('path-selection-completed', this.currentPath.map((e) => e.position));
            this.clearCurrentPath();
            return;
        }

        this.activatePathSelection(position, moves);

        

        this.currentPath.push(new PathElement(
            this.graphics,
            position,
            this.x,
            this.y,
            this.tileSize
        ));
    }

    private clearCurrentPath()
    {
        for (let pathElement of this.currentPath)
        {
            pathElement.dot.destroy();
        }

        this.currentPath = [];
    }


    private clearCurrentAdjacents()
    {
        for (let adjacent of this.currentAdjacents) {
            const tileSprite = this.tileSprites[adjacent.row][adjacent.col];

            tileSprite.removeInteractive();
            tileSprite.removeAllListeners();
            tileSprite.clearTint();
            tileSprite.clearAlpha();
        }
    }
}

class PlayerSprite
{
    private text: Phaser.GameObjects.Text;
    private sprite: Phaser.GameObjects.Sprite;
    private displayId: number;
    private data: Player;

    constructor(
        scene: Phaser.Scene, 
        player: Player,
        boardX: number,
        boardY: number,
        size: number,
        displayId: number, 
        texture: string 
    ) {
        const textStyle = {
            fontSize: '20px',
            color: '#000000',
            fixedWidth: TILE_SIZE / 2,
            align: "center",
            backgroundColor: '#FFFFFF'
        }
        const x = boardX + player.position.col * size;
        const y = boardY + player.position.row * size;
        
        this.text = scene.add.text(x - size / 4, y - 1.2 * size, displayId.toString(), textStyle);
        this.sprite = scene.add.sprite(x, y, texture);
        this.displayId = displayId;
        this.data = player;
    }

    markAsPlayer()
    {
        this.sprite.setTint(0xAA0000);
        this.text.text += "(YOU)";
    }

    getBoardPosition(): Position
    {
        return this.data.position;
    }
}