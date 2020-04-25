"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const common_1 = require("../../../common");
const Client_1 = require("../client/Client");
exports.TILE_SIZE = 32;
class BoardScene extends phaser_1.default.Scene {
    constructor(handle, parent) {
        super(handle);
        this.backend = Client_1.Client.get();
        this.players = new Map();
        this.parent = parent;
    }
    init(state) {
        this.state = state;
    }
    create() {
        this.createBoard();
        this.setUpPlayerSprites();
        this.setUpEvents();
        this.players.get(this.state.userId).markAsPlayer();
    }
    addPlayer(player) {
        this.addPlayerSprite(player, this.players.size);
    }
    createBoard() {
        this.board = new BoardTiles(this, this.state.game.board, this.parent.x, this.parent.y, exports.TILE_SIZE);
    }
    setUpPlayerSprites() {
        this.state.game.players.map((player, index) => this.addPlayerSprite(player, index));
    }
    addPlayerSprite(player, index) {
        const sprite = new PlayerSprite(this, player, this.parent.x, this.parent.y, exports.TILE_SIZE, index + 1, "player");
        this.players.set(player.userId, sprite);
    }
    setUpEvents() {
        this.backend.on(common_1.EventType.PLAYER_JOINED, (event) => this.onPlayerJoined(event));
        this.backend.on(common_1.EventType.NEXT_TURN, (event) => this.onTurnStarted(event));
        this.backend.on(common_1.EventType.PLAYER_MOVED, (event) => this.onPlayerMoved(event));
        this.backend.on(common_1.EventType.PLAYER_DIED, (event) => this.onPlayerDied(event));
        this.backend.on(common_1.EventType.PLAYER_HIT, (event) => this.onPlayerHit(event));
        this.backend.on(common_1.EventType.PLAYER_LEFT, (event) => this.onPlayerLeft(event));
        this.backend.on(common_1.EventType.BOARD_CHANGED, (event) => {
            this.board.replaceTile(event.position, event.tileType);
        });
    }
    onPlayerJoined(event) {
        if (this.state.userId === event.player.userId)
            return;
        this.addPlayerSprite(event.player, this.players.size);
    }
    onTurnStarted(event) {
        this.board.clearCurrentPath();
        if (this.state.userId === event.turn.currentlyPlaying) {
            const player = this.players.get(event.turn.currentlyPlaying);
            this.board.activatePathSelection(player.getBoardPosition(), event.turn.stepPoints);
        }
    }
    onPlayerMoved(event) {
        const player = this.players.get(event.userId);
        player.movePath(event.pathUsed);
    }
    onPlayerDied(event) {
        const player = this.players.get(event.userId);
        player.movePath([event.movedTo]);
        player.setHp(event.hp, 100);
    }
    onPlayerHit(event) {
        this.players.get(event.userId).setHp(event.currentHp, event.hpTaken);
    }
    onPlayerLeft(event) {
        const player = this.players.get(event.userId);
        player.destroy();
        this.players.delete(event.userId);
    }
}
exports.BoardScene = BoardScene;
class PathElement {
    constructor(scene, position, boardX, boardY, size) {
        const dotX = boardX + position.col * size;
        const dotY = boardY + position.row * size;
        this.dot = scene.add.sprite(dotX, dotY, 'player');
        this.dot.setAlpha(0.4);
        //this.dot = graphics.fillCircle(dotX, dotY, 10);
        //this.dot.depth = 1000;
        this.position = position;
    }
}
class BoardTiles {
    constructor(scene, tiles, x, y, tileSize) {
        this.tiles = [];
        this.tileSprites = [];
        this.currentPath = [];
        this.x = x;
        this.y = y;
        this.tiles = tiles;
        this.scene = scene;
        this.tileSize = tileSize;
        this.createTileSrpites(scene);
    }
    replaceTile(position, type) {
        console.debug("Replacing: ", position);
        this.tiles[position.row][position.col].type = common_1.TileType.PATH;
        this.tileSprites[position.row][position.col].destroy();
        this.tileSprites[position.row][position.col] = this.scene.add.sprite(this.x + position.col * this.tileSize, this.y + position.row * this.tileSize, "path");
        this.tileSprites[position.row][position.col].depth = 0;
    }
    createTileSrpites(scene) {
        const tiles = this.tiles;
        scene.anims.create({
            key: "default",
            frames: scene.anims.generateFrameNumbers('spikes', { start: 0, end: 21, }),
            frameRate: 20,
            repeat: -1
        });
        const textures = new Map([
            [common_1.TileType.FINISH_POINT, "finish"],
            [common_1.TileType.PATH, "path"],
            [common_1.TileType.SPIKES, "spikes"],
            [common_1.TileType.STARTING_POINT, "path"],
            [common_1.TileType.WALL, "wall"],
            [common_1.TileType.HOLE_ONE, "h1"],
            [common_1.TileType.HOLE_TWO, "h2"],
            [common_1.TileType.HOLE_THREE, "h3"],
            [common_1.TileType.HOLE_FOUR, "h4"],
            [common_1.TileType.KEY_ONE, "k1"],
            [common_1.TileType.KEY_TWO, "k2"],
            [common_1.TileType.KEY_THREE, "k3"],
            [common_1.TileType.KEY_FOUR, "k4"]
        ]);
        for (let i = 0; i < tiles.length; i++) {
            const sprites = [];
            for (let j = 0; j < tiles[i].length; j++) {
                const x = this.x + j * this.tileSize;
                const y = this.y + i * this.tileSize;
                const texture = textures.get(tiles[i][j].type);
                const sprite = scene.add.sprite(x, y, texture);
                if (texture === "spikes") {
                    sprite.anims.play('default');
                }
                sprites.push(sprite);
            }
            this.tileSprites.push(sprites);
        }
    }
    activatePathSelection(position, moves) {
        this.currentAdjacents = this.findValidAdjacentsOf(position);
        for (let adjacent of this.currentAdjacents) {
            this.enableClicks(adjacent, moves);
        }
    }
    findValidAdjacentsOf(position) {
        const proposals = [
            { row: position.row, col: position.col - 1 },
            { row: position.row, col: position.col + 1 },
            { row: position.row - 1, col: position.col },
            { row: position.row + 1, col: position.col }
        ];
        return proposals.filter(position => this.isValid(position));
    }
    isValid(position) {
        const boardHeight = this.tiles.length;
        const exists = ((position.row >= 0) &&
            (position.row < boardHeight) &&
            (position.col >= 0) &&
            (position.col < this.tiles[position.row].length));
        return exists && this.isWalkable(position);
    }
    isWalkable(position) {
        const tile = this.tiles[position.row][position.col];
        return tile.type !== common_1.TileType.WALL;
    }
    enableClicks(position, moves) {
        const tileSprite = this.tileSprites[position.row][position.col];
        tileSprite.setTint(0x00FF00);
        tileSprite.setInteractive();
        tileSprite.on('pointerover', () => tileSprite.setAlpha(0.8));
        tileSprite.on('pointerout', () => tileSprite.clearAlpha());
        tileSprite.on('pointerdown', () => this.selectPathElement(position, moves));
    }
    selectPathElement(position, moves) {
        this.clearCurrentAdjacents();
        this.currentPath.push(new PathElement(this.scene, position, this.x, this.y, this.tileSize));
        moves -= 1;
        this.scene.events.emit('path-elem-selected', moves);
        if (moves === 0) {
            this.scene.events.emit('path-selection-completed', this.currentPath.map((e) => e.position));
            return;
        }
        this.activatePathSelection(position, moves);
    }
    clearCurrentPath() {
        this.currentPath.forEach(elem => elem.dot.destroy());
        this.currentPath = [];
    }
    clearCurrentAdjacents() {
        for (let adjacent of this.currentAdjacents) {
            const tileSprite = this.tileSprites[adjacent.row][adjacent.col];
            tileSprite.removeInteractive();
            tileSprite.removeAllListeners();
            tileSprite.clearTint();
            tileSprite.clearAlpha();
        }
    }
}
class PlayerSprite {
    constructor(scene, player, boardX, boardY, size, displayId, texture) {
        this.colors = ['#f8007e', '#f80000', '#3b5d21', '#00fff9'];
        console.log('color ', this.colors[displayId - 1]);
        const textStyle = {
            fontSize: '15px',
            color: '#000000',
            align: "center",
            backgroundColor: this.colors[displayId - 1]
        };
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
    markAsPlayer() {
        this.sprite.setTint(0xAA0000);
        this.text.text += "(YOU)";
    }
    getBoardPosition() {
        return this.data.position;
    }
    movePath(path) {
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
            });
        }
        timeline.play();
        timeline.on('complete', () => {
            console.log('COmpleted', this.sprite.x, this.sprite.y);
            this.text.x = this.sprite.x - this.size / 2;
            this.text.y = this.sprite.y - 1.2 * this.size;
        });
    }
    setHp(hp, hpTaken) {
        let value = hpTaken;
        let color = '#00FF00';
        if (this.data.hp > hp) {
            value = -1 * hpTaken;
            color = '#FF0000';
        }
        const hpTakenText = this.scene.add.text(this.sprite.x + phaser_1.default.Math.Between(0, 50), this.sprite.y + phaser_1.default.Math.Between(-150, 50), value.toString(), {
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
                hpTakenText.destroy();
            }
        });
        this.text.text = `${this.data.userName} (${hp})`;
    }
    destroy() {
        this.text.destroy();
        this.sprite.destroy();
    }
}
//# sourceMappingURL=BoardScene.js.map