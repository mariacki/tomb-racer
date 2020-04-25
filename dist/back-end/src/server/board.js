"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../game");
const common_1 = require("../../../common");
const events_1 = require("../game/events");
const rnd_1 = __importDefault(require("../rnd"));
function createNOfType(n, type) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result.push(type());
    }
    return result;
}
class KeyHole extends game_1.Tile {
    isWalkable() {
        return true;
    }
    onPlaced(player, game) {
        console.debug("Player inventory", player.inventory);
        console.debug("I open when", this.keyName);
        if (player.inventory.includes(this.keyName)) {
            game.board.tiles[this.opens.row][this.opens.col] = game_1.Tiles.path()(this.opens.row, this.opens.col);
            const doorOpened = {
                type: common_1.EventType.BOARD_CHANGED,
                isError: false,
                origin: game.id,
                position: this.opens,
                tileType: common_1.TileType.PATH
            };
            const others = game.players.getAll().filter((p) => p.userId != p.userId);
            others.forEach(p => p.position = p.startedOn);
            const deathEvents = others.map((p) => new events_1.PlayerDiedEvent(game.id, p));
            return [doorOpened, ...deathEvents];
        }
        else {
            return [];
        }
    }
}
class KillRandom extends game_1.Tile {
    onPlaced(player, game) {
        const events = [];
        const others = game.players.getAll().filter((p) => p.userId != player.userId);
        if (!others.length) {
            return [];
        }
        const random = rnd_1.default(0, others.length);
        console.log(random);
        const target = others[random];
        target.hp -= 5;
        target.position = target.startedOn;
        return others.map((p) => new events_1.PlayerDiedEvent(game.id, target));
    }
}
class Key extends game_1.Tile {
    isWalkable() {
        return true;
    }
    onWalkThrough(player, game) {
        player.inventory.push(this.holds);
        game.board.tiles[this.position.row][this.position.col] = new game_1.Tile(common_1.TileType.PATH, this.position);
        if (!player.startedOn.equals(this.player)) {
            return [];
        }
        const doorOpened = {
            type: common_1.EventType.BOARD_CHANGED,
            isError: false,
            origin: game.id,
            position: this.position,
            tileType: common_1.TileType.PATH
        };
        const itemPicked = {
            type: common_1.EventType.ITEM_PICKED,
            isError: false,
            origin: game.id,
            item: this.holds
        };
        return [doorOpened, itemPicked];
    }
}
const board = [
    createNOfType(17, game_1.Tiles.wall),
    [game_1.Tiles.wall(), game_1.Tiles.path(), game_1.Tiles.startingPoint(), ...createNOfType(11, game_1.Tiles.wall), game_1.Tiles.startingPoint(), game_1.Tiles.path(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), ...createNOfType(13, game_1.Tiles.path), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(4, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(11, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), ...createNOfType(5, game_1.Tiles.path), game_1.Tiles.wall(), game_1.Tiles.finishPoint(), game_1.Tiles.wall(), ...createNOfType(5, game_1.Tiles.path), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.wall(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(3, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), ...createNOfType(4, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), ...createNOfType(5, game_1.Tiles.wall), game_1.Tiles.path(), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.wall(), ...createNOfType(13, game_1.Tiles.path), game_1.Tiles.wall(), game_1.Tiles.wall()],
    [game_1.Tiles.wall(), game_1.Tiles.path(), game_1.Tiles.startingPoint(), ...createNOfType(11, game_1.Tiles.wall), game_1.Tiles.startingPoint(), game_1.Tiles.path(), game_1.Tiles.wall()],
    createNOfType(17, game_1.Tiles.wall),
];
const k2 = new Key(common_1.TileType.KEY_TWO, game_1.TilePosition.fromDto({ row: 1, col: 1 }));
const k1 = new Key(common_1.TileType.KEY_ONE, game_1.TilePosition.fromDto({ row: 1, col: 15 }));
const k3 = new Key(common_1.TileType.KEY_THREE, game_1.TilePosition.fromDto({ row: 13, col: 1 }));
const k4 = new Key(common_1.TileType.KEY_FOUR, game_1.TilePosition.fromDto({ row: 13, col: 15 }));
k1.holds = "k1";
k2.holds = "k2";
k3.holds = "k3";
k4.holds = "k4";
k1.player = game_1.TilePosition.fromDto({ row: 13, col: 2 });
k2.player = game_1.TilePosition.fromDto({ row: 13, col: 14 });
k3.player = game_1.TilePosition.fromDto({ row: 1, col: 14 });
k4.player = game_1.TilePosition.fromDto({ row: 1, col: 2 });
board[1][1] = (row, col) => k2;
board[1][15] = (row, col) => k1;
board[13][1] = (row, col) => k3;
board[13][15] = (row, col) => k4;
const h1 = new KeyHole(common_1.TileType.HOLE_ONE, game_1.TilePosition.fromDto({ row: 8, col: 6 }));
const h2 = new KeyHole(common_1.TileType.HOLE_TWO, game_1.TilePosition.fromDto({ row: 9, col: 9 }));
const h3 = new KeyHole(common_1.TileType.HOLE_THREE, game_1.TilePosition.fromDto({ row: 6, col: 10 }));
const h4 = new KeyHole(common_1.TileType.HOLE_FOUR, game_1.TilePosition.fromDto({ row: 5, col: 7 }));
h1.opens = { row: 7, col: 7 };
h1.keyName = "k1";
h2.opens = { row: 8, col: 8 };
h2.keyName = "k2";
h3.opens = { row: 7, col: 9 };
h3.keyName = "k3";
h4.opens = { row: 6, col: 8 };
h4.keyName = "k4";
board[8][6] = (row, col) => h1;
board[9][9] = (row, col) => h2;
board[6][10] = (row, col) => h3;
board[5][7] = (row, col) => h4;
const kr1 = new KillRandom(common_1.TileType.KILL_RADNOM, game_1.TilePosition.fromDto({ row: 1, col: 8 }));
const kr2 = new KillRandom(common_1.TileType.KILL_RADNOM, game_1.TilePosition.fromDto({ row: 13, col: 8 }));
board[1][8] = (row, col) => kr1;
board[13][8] = (row, col) => kr2;
board[2][4] = game_1.Tiles.spikes();
board[2][12] = game_1.Tiles.spikes();
board[12][4] = game_1.Tiles.spikes();
board[12][12] = game_1.Tiles.spikes();
exports.default = () => board;
//# sourceMappingURL=board.js.map