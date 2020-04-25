"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const Client_1 = require("../client/Client");
const common_1 = require("../../../common");
const InputText_1 = require("../ui/InputText");
const consts_1 = require("./consts");
const bg = require('./../../assets/img/background.png');
const logo = require('./../../assets/img/logo.png');
const enterKey = require('./../../assets/img/enter.png');
const START_Y = 250;
const TEXT_WIDTH = 400;
const TEXT_HEIGHT = 50;
const VERTICAL_DISTANCE = 15;
const TEXT_STYLE = Object.assign(Object.assign({}, consts_1.COMMON_TEXT_STYLE), { fixedWidth: TEXT_WIDTH, fixedHeight: TEXT_HEIGHT });
const INPUT_STYLE_FIXED = Object.assign(Object.assign({}, consts_1.INPUT_STYLE), { fixedWidth: TEXT_WIDTH, fixedHeight: TEXT_HEIGHT });
const TEXT_STYLE_ERROR = {
    color: "#FFFFFF",
    fontSize: "30px",
    backgroundColor: "#FF0000"
};
class LoginScreen extends phaser_1.default.Scene {
    constructor() {
        super(...arguments);
        this.backend = Client_1.Client.get();
        this.currentRotation = 0;
        this.targetRotation = 3;
    }
    ;
    preload() {
        this.load.image('bg', bg);
        this.load.image('logo', logo);
        this.load.image('enter', enterKey);
    }
    create() {
        this.add.image(consts_1.CENTER_X, consts_1.CENTER_Y, "bg");
        this.logo = this.add.sprite(consts_1.CENTER_X, 100, "logo");
        this.createPrompt();
        this.createLoginInput();
        this.createErrorText();
        this.createEnterKey();
    }
    createPrompt() {
        const prompt = this.add.text(consts_1.CENTER_X - TEXT_WIDTH / 2, START_Y, "ODKRYWCA:", TEXT_STYLE);
        return prompt;
    }
    createLoginInput() {
        const inputConfig = {
            x: consts_1.CENTER_X - (TEXT_WIDTH / 2),
            y: START_Y + TEXT_HEIGHT + VERTICAL_DISTANCE,
            maxChars: 11,
        };
        this.login = new InputText_1.TextInput(this, inputConfig, INPUT_STYLE_FIXED);
    }
    createErrorText() {
        this.errorText = this.add.text(0, 0, "", TEXT_STYLE_ERROR);
        this.errorText.setX(consts_1.CENTER_X - (TEXT_WIDTH / 2));
        this.errorText.setY(START_Y + 2 * (TEXT_HEIGHT + VERTICAL_DISTANCE));
    }
    createEnterKey() {
        const enterKey = this.add.sprite(0, 0, "enter");
        enterKey.setScale(0.5, 0.5);
        enterKey.setX(consts_1.CENTER_X + (TEXT_WIDTH / 2) - (enterKey.width / 4));
        enterKey.setY(START_Y + 3 * (TEXT_HEIGHT + VERTICAL_DISTANCE) + (enterKey.height / 4));
        enterKey.setInteractive();
        enterKey.on('pointerover', () => enterKey.setAlpha(0.7));
        enterKey.on('pointerout', () => enterKey.clearAlpha());
        enterKey.on('pointerdown', () => this.performLogin(this.login.value()));
    }
    update() {
        this.rotateLogo();
    }
    rotateLogo() {
        if (Math.abs(this.currentRotation - this.targetRotation) <= 0.001) {
            this.targetRotation *= -1;
        }
        const sign = Math.sign(this.currentRotation - this.targetRotation);
        const revSign = -1 * sign;
        this.currentRotation += revSign * 0.1;
        this.logo.setRotation(this.currentRotation * Math.PI / 180);
    }
    performLogin(login) {
        if (this.loginInvalid()) {
            this.setErrorText();
            return;
        }
        this.backend.on(common_1.EventType.LOGIN_SUCCESS, (event) => {
            this.scene.start("lobby", {
                games: event.games,
                userId: event.userId
            });
            this.scene.stop();
        });
        const command = {
            type: common_1.CommandType.LOGIN,
            userName: login
        };
        this.backend.send(command);
    }
    loginInvalid() {
        return this.login.value() === "";
    }
    setErrorText() {
        this.errorText.text = "To pole jest wymagane";
    }
}
exports.LoginScreen = LoginScreen;
//# sourceMappingURL=LoginScreen.js.map