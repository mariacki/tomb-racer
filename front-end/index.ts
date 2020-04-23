import { LoginScreen } from './src/scene/LoginScreen';
import { Lobby } from './src/scene/Lobby';
import { GameScene } from './src/scene/GameScene';
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: null
}

const game = new Phaser.Game(config);

game.scene.add("game", GameScene, false);
game.scene.add("login-screen", LoginScreen, true);
game.scene.add("lobby", Lobby, false);
