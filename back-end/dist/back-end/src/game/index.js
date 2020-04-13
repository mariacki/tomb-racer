"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contract = __importStar(require("./contract"));
exports.contract = contract;
const DefaultGameService_1 = require("./service/DefaultGameService");
const Tile_1 = require("./model/tile/Tile");
const Position_1 = __importDefault(require("./contract/dto/Position"));
exports.Tiles = {
    startingPoint() {
        return (row, col) => {
            return new Tile_1.Tile(Tile_1.TileType.STARTING_POINT, new Position_1.default(row, col));
        };
    },
    path() {
        return (row, col) => {
            return new Tile_1.Tile(Tile_1.TileType.PATH, new Position_1.default(row, col));
        };
    },
    wall() {
        return (row, col) => {
            return new Tile_1.Tile(Tile_1.TileType.WALL, new Position_1.default(row, col));
        };
    },
    spikes() {
        return (row, col) => {
            return new Tile_1.SipikedTile(new Position_1.default(row, col));
        };
    },
    finishPoint() {
        return (row, col) => {
            return new Tile_1.Tile(Tile_1.TileType.FINISH_POINT, new Position_1.default(row, col));
        };
    }
};
exports.configure = (ctx) => {
    return new DefaultGameService_1.DefaultGameService(ctx);
};
//# sourceMappingURL=index.js.map