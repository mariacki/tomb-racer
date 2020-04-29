import Phaser, { Scene } from 'phaser';
import { Position, TileType, Tile, Game, Player, PlayerJoined, EventType, TurnStarted, PlayerMoved, PlayerDied, PlayerHit, PlayerLeft } from '../../../common';
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
        this.players.get(this.state.userId).markAsPlayer();
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
        this.backend.on(EventType.PLAYER_JOINED, (event: PlayerJoined) => this.onPlayerJoined(event));
        this.backend.on(EventType.NEXT_TURN, (event: TurnStarted) => this.onTurnStarted(event));        
        this.backend.on(EventType.PLAYER_MOVED, (event: PlayerMoved) => this.onPlayerMoved(event));
        this.backend.on(EventType.PLAYER_DIED, (event: PlayerDied) => this.onPlayerDied(event));
        this.backend.on(EventType.PLAYER_HIT, (event: PlayerHit) => this.onPlayerHit(event));
        this.backend.on(EventType.PLAYER_LEFT, (event: PlayerLeft) => this.onPlayerLeft(event));
        this.backend.on(EventType.BOARD_CHANGED, (event: any) => {
            this.board.replaceTile(event.position, event.tileType);
        })
    }

    private onPlayerJoined(event: PlayerJoined)
    {
        if (this.state.userId === event.player.userId) return;
        this.addPlayerSprite(event.player, this.players.size);
    } 

    private onTurnStarted(event: TurnStarted)
    {
        this.board.clearCurrentPath();

        if (this.state.userId === event.turn.currentlyPlaying) {
            const player = this.players.get(event.turn.currentlyPlaying);
            this.board.activatePathSelection(player.getBoardPosition(), event.turn.stepPoints);
        }
    }

    private onPlayerMoved(event: PlayerMoved)
    {
        const player = this.players.get(event.userId);

        player.movePath(event.pathUsed);
    }

    private onPlayerDied(event: PlayerDied)
    {
        const player = this.players.get(event.userId);

        player.movePath([event.movedTo]);
        player.setHp(event.hp, 100);
    }

    private onPlayerHit(event: PlayerHit)
    {
        
        this.players.get(event.userId).setHp(event.currentHp, event.hpTaken);
    }

    private onPlayerLeft(event: PlayerLeft)
    {
        const player = this.players.get(event.userId);
        player.destroy();

        this.players.delete(event.userId);
    }
}

class PathElement
{
    readonly position: Position;
    readonly dot: Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        position: Position,
        boardX: number,
        boardY: number,
        size: number
    ) {
        const dotX = boardX + position.col * size;
        const dotY = boardY + position.row * size;

        this.dot = scene.add.sprite(dotX, dotY, 'player');
        this.dot.setAlpha(0.4);

        //this.dot = graphics.fillCircle(dotX, dotY, 10);
        //this.dot.depth = 1000;
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
        this.createTileSrpites(scene);
    }

    replaceTile(position: Position, type: any)
    {
        console.debug("Replacing: ", position);
        this.tiles[position.row][position.col].type = TileType.PATH;
        this.tileSprites[position.row][position.col].destroy();
        this.tileSprites[position.row][position.col] = this.scene.add.sprite(
            this.x + position.col * this.tileSize,
            this.y + position.row * this.tileSize,
            "path"
        );
        this.tileSprites[position.row][position.col].depth = 0;
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
            [TileType.FINISH_POINT, "finish"],
            [TileType.PATH, "path"],
            [TileType.SPIKES, "spikes"],
            [TileType.STARTING_POINT, "path"],
            [TileType.WALL, "wall"],
            [TileType.HOLE_ONE, "h1"],
            [TileType.HOLE_TWO, "h2"],
            [TileType.HOLE_THREE, "h3"],
            [TileType.HOLE_FOUR, "h4"],
            [TileType.KEY_ONE, "k1"],
            [TileType.KEY_TWO, "k2"],
            [TileType.KEY_THREE, "k3"],
            [TileType.KEY_FOUR, "k4"],
            [TileType.TREASURE, "finish"]
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
        return tile.type !== TileType.WALL;
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

        this.currentPath.push(new PathElement(
            this.scene,
            position,
            this.x,
            this.y,
            this.tileSize
        ));

        moves -= 1;
        this.scene.events.emit('path-elem-selected', moves);

        if (moves === 0) {
            this.scene.events.emit('path-selection-completed', this.currentPath.map((e) => e.position));
            return;
        }

        this.activatePathSelection(position, moves);
    }

    clearCurrentPath()
    {
        this.currentPath.forEach(elem => elem.dot.destroy())
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
    private size: number;
    private boardX: number;
    private boardY: number;
    private scene: Scene;
    private colors = ['#f8007e', '#f80000', '#00fff9', '#3b5d21', ]


    constructor(
        scene: Phaser.Scene, 
        player: Player,
        boardX: number,
        boardY: number,
        size: number,
        displayId: number, 
        texture: string 
    ) {
        console.log('color ', this.colors[displayId-1]);
        const textStyle = {
            fontSize: '15px',
            color: '#000000',
            align: "center",
            backgroundColor: this.colors[displayId-1]
        }
        const x = boardX + player.position.col * size;
        const y = boardY + player.position.row * size;
        const text = `${player.userName} (${player.hp})`;

        this.text = scene.add.text(x - size / 2, y - 1.2 * size, text, textStyle);
        this.sprite = scene.add.sprite(x, y, texture);
        this.sprite.depth = 10000;
        this.displayId = displayId;
        this.data = player;
        this.size = size;
        this.boardX = boardX;
        this.boardY = boardY;
        this.scene = scene;
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

    movePath(path: Position[])
    {
        const last = path[path.length - 1];
        const timeline = this.scene.tweens.createTimeline();
        this.data.position = last;
        for (let pos of path) {
            timeline.add({
                targets: [this.sprite, this.text],
                x: this.boardX + pos.col * this.size,
                y: this.boardY + pos.row * this.size,
                ease: 'Power1',
                duration: 200
            })
        }

        timeline.play();

        timeline.on('complete', () => {
            console.log('COmpleted', this.sprite.x, this.sprite.y);
            this.text.x = this.sprite.x - this.size / 2
            this.text.y = this.sprite.y - 1.2 * this.size;
            
        });
    }

    setHp(hp: Number, hpTaken: number)
    {
        let value = hpTaken;
        let color = '#00FF00';
        if (this.data.hp > hp) {
            value = -1* hpTaken;
            color = '#FF0000';
        }
        const hpTakenText = this.scene.add.text(
            this.sprite.x + Phaser.Math.Between(0, 50), 
            this.sprite.y + Phaser.Math.Between(-150, 50), 
            value.toString(), {
            color,
            fontSize: '50px'
        });
        
        const hpTakenTween = this.scene.tweens.addCounter({
            from: 0,
            to: 20,
            duration: 3000,
            onUpdate() {
                hpTakenText.alpha -= 0.02;
            },
            onComplete() {
                hpTakenText.destroy()
            }
        })

        this.text.text = `${this.data.userName} (${hp})`;
    }

    destroy()
    {
        this.text.destroy();
        this.sprite.destroy();
    }
}