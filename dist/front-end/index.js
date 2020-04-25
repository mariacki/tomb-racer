"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginScreen_1 = require("./src/scene/LoginScreen");
const Lobby_1 = require("./src/scene/Lobby");
const GameScene_1 = require("./src/scene/GameScene");
const phaser_1 = __importDefault(require("phaser"));
const config = {
    type: phaser_1.default.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
};
const game = new phaser_1.default.Game(config);
game.scene.add("game", GameScene_1.GameScene, false);
game.scene.add("login-screen", LoginScreen_1.LoginScreen, true);
game.scene.add("lobby", Lobby_1.Lobby, false);
//# sourceMappingURL=index.js.map