"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const common_1 = require("../../../common");
const Client_1 = require("../client/Client");
class GUI extends phaser_1.default.Scene {
    constructor(key, parent) {
        super(key);
        this.backend = Client_1.Client.get();
        this.parent = parent;
    }
    init(state) {
        this.state = state;
    }
    create() {
        const headerStyle = {
            fixedWidth: this.parent.width - 20,
            fixedHeight: 22,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            fontSize: '20px'
        };
        const elementStyle = {
            fixedHeight: 22,
            fixedWidth: this.parent.width - 20,
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontSize: '20px'
        };
        this.turnInfoHeader = this.add.text(this.parent.x, this.parent.y, "Now playing:", headerStyle);
        this.turnInfoText = this.add.text(this.parent.x, this.parent.y + 22, "N / A", elementStyle);
        const movesLeft = this.add.text(this.parent.x, this.parent.y + 44, "Moves Left:", headerStyle);
        const movesLeftValue = this.add.text(this.parent.x, this.parent.y + 66, "N / A", elementStyle);
        const actionsHeader = this.add.text(this.parent.x, this.parent.y + 88, "Actions: ", headerStyle);
        const actionsElement = this.add.text(this.parent.x, this.parent.y + 110, "Idź", elementStyle);
        actionsElement.setAlpha(0.2);
        this.backend.on(common_1.EventType.NEXT_TURN, (event) => {
            const player = this.state.game.players.filter(p => p.userId === event.turn.currentlyPlaying)[0];
            this.turnInfoText.text = player.userName;
            movesLeftValue.text = event.turn.stepPoints.toString();
            actionsElement.removeInteractive();
            actionsElement.setAlpha(0.2);
        });
        this.backend.on(common_1.EventType.ITEM_PICKED, (event) => {
            this.add.sprite(actionsElement.x, actionsElement.y + 50, event.item);
        });
        const emiter = this.scene.get('board').events;
        emiter.on('path-elem-selected', (moves) => {
            console.log('Intercepted event');
            movesLeftValue.text = moves.toString();
        });
        emiter.on('path-selection-completed', (path) => {
            actionsElement.clearAlpha();
            actionsElement.setBackgroundColor("#ff0000");
            actionsElement.setInteractive();
            actionsElement.on('pointerhover', () => actionsElement.setAlpha(0.9));
            actionsElement.on('pointerout', () => actionsElement.clearAlpha());
            actionsElement.on('pointerdown', () => {
                this.sendMovement(path);
                actionsElement.removeInteractive();
                actionsElement.removeAllListeners();
                actionsElement.setAlpha(0.2);
            });
        });
    }
    sendMovement(path) {
        const command = {
            type: common_1.CommandType.MOVE,
            path
        };
        this.backend.send(command);
    }
}
exports.GUI = GUI;
//# sourceMappingURL=GUI.js.map