import Phaser, { Scenes } from 'phaser';
import { Client } from '../client/Client';
import { Login, CommandType, SuccessfullLogin, EventType } from 'tr-common';
import { TextInput, TextInputConfig } from '../ui/InputText';
import { CENTER_X, CENTER_Y, COMMON_TEXT_STYLE, INPUT_STYLE } from './consts';

const bg = require('./../../assets/img/background.png');
const logo = require('./../../assets/img/logo.png');
const enterKey = require('./../../assets/img/enter.png');

const START_Y = 250;

const TEXT_WIDTH = 400;
const TEXT_HEIGHT = 50;

const VERTICAL_DISTANCE = 15;

const TEXT_STYLE = {
    ...COMMON_TEXT_STYLE,
    fixedWidth: TEXT_WIDTH,
    fixedHeight: TEXT_HEIGHT
}

const INPUT_STYLE_FIXED = {
    ...INPUT_STYLE,
    fixedWidth: TEXT_WIDTH,
    fixedHeight: TEXT_HEIGHT
}

const TEXT_STYLE_ERROR = {
    color: "#FFFFFF", 
    fontSize: "30px", 
    backgroundColor: "#FF0000"
}

export class LoginScreen extends Phaser.Scene
{
    private backend: Client = Client.get();;
    private logo: Phaser.GameObjects.Sprite;
    private currentRotation: number = 0;
    private targetRotation: number = 3;
    private errorText: Phaser.GameObjects.Text;
    private login: TextInput;

    preload()
    {
        this.load.image('bg', bg);
        this.load.image('logo', logo);
        this.load.image('enter', enterKey);
    }

    create()
    {
        this.add.image(CENTER_X, CENTER_Y, "bg");
        this.logo = this.add.sprite(CENTER_X, 100, "logo");
        this.createPrompt();
        this.createLoginInput();
        this.createErrorText();
        this.createEnterKey();
    }

    private createPrompt()
    {
        const prompt = this.add.text(
            CENTER_X - TEXT_WIDTH / 2, 
            START_Y, 
            "ODKRYWCA:", 
            TEXT_STYLE
        );

        return prompt;
    }

    private createLoginInput()
    {
        const inputConfig: TextInputConfig = {
            x: CENTER_X - (TEXT_WIDTH  / 2),
            y: START_Y + TEXT_HEIGHT + VERTICAL_DISTANCE,
            maxChars: 11,
        }

        this.login = new TextInput(this, inputConfig, INPUT_STYLE_FIXED);
    }

    private createErrorText()
    {
        this.errorText = this.add.text(0, 0, "", TEXT_STYLE_ERROR);
        this.errorText.setX(CENTER_X - (TEXT_WIDTH / 2));
        this.errorText.setY(START_Y + 2 * (TEXT_HEIGHT + VERTICAL_DISTANCE));
    }

    private createEnterKey()
    {
        const enterKey = this.add.sprite(0, 0, "enter");
        enterKey.setScale(0.5, 0.5)
        enterKey.setX(CENTER_X + (TEXT_WIDTH /2) - (enterKey.width / 4));
        enterKey.setY(START_Y + 3 * (TEXT_HEIGHT + VERTICAL_DISTANCE) + (enterKey.height / 4));
        enterKey.setInteractive();
        enterKey.on('pointerover', () => enterKey.setAlpha(0.7))
        enterKey.on('pointerout', () => enterKey.clearAlpha())
        enterKey.on('pointerdown', () => this.performLogin(this.login.value()));
    }

    update() 
    {
        this.rotateLogo();
    }

    private rotateLogo()
    {
        if (Math.abs(this.currentRotation - this.targetRotation) <= 0.001) {
            this.targetRotation *= -1;
        }

        const sign = Math.sign(this.currentRotation - this.targetRotation);
        const revSign = -1 * sign;

        this.currentRotation += revSign * 0.1;

        this.logo.setRotation(this.currentRotation * Math.PI/180);
    }

    private performLogin(login: string) 
    {
        if (this.loginInvalid()) {
            this.setErrorText();
            return;
        }

        this.backend.on(EventType.LOGIN_SUCCESS,(event: SuccessfullLogin) => {
            this.scene.start("lobby", {
                games: event.games,
                userId: event.userId
            });
            this.scene.stop();
        });

        const command: Login = {
            type: CommandType.LOGIN,
            userName: login
        }

        this.backend.send(command);
    }

    private loginInvalid(): boolean
    {
        return this.login.value() === "";
    }

    private setErrorText(): void
    {
        this.errorText.text = "To pole jest wymagane";
    }
}


