"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerHit_1 = __importDefault(require("../../events/PlayerHit"));
var TileType;
(function (TileType) {
    TileType["PATH"] = "PATH";
    TileType["WALL"] = "WALL";
    TileType["STARTING_POINT"] = "STARTING_POINT";
    TileType["SPIKES"] = "SPIKES";
    TileType["FINISH_POINT"] = "FINISH_POINT";
})(TileType = exports.TileType || (exports.TileType = {}));
class Tile {
    constructor(type, position) {
        this.type = type;
        this.position = position;
    }
    isWalkable() {
        return this.type == TileType.PATH ||
            this.type == TileType.STARTING_POINT ||
            this.type == TileType.FINISH_POINT;
    }
    onWalkThrough(player, context, game) { }
    onPlaced(player, board, context) { }
}
exports.Tile = Tile;
const HIT_VALUE = 20;
class SipikedTile extends Tile {
    constructor(position) {
        super(TileType.SPIKES, position);
    }
    isWalkable() {
        return true;
    }
    onWalkThrough(player, context, game) {
        player.hp -= HIT_VALUE;
        context.eventDispatcher.dispatch(new PlayerHit_1.default(game.id, player.userId, HIT_VALUE, player.hp));
    }
}
exports.SipikedTile = SipikedTile;
//# sourceMappingURL=Tile.js.map