import Phaser from 'phaser';
import { GameController } from '../../GameController';
const loginForm = require('../../../assets/form/login.html.template');


export class LoginScreen extends Phaser.Scene
{
    controller: GameController;

    init(controller) {
        this.controller = controller;
    }

    preload() {
        this.load.html('login', loginForm);
    }

    create() {
        const html = this.add.dom(400, 300).createFromCache('login');
       
        const login = (username: string) => {
            this.controller.login(username);
        }

        html.addListener('click');
        html.on('click', function(event: any) {
            if (event.target.name !== "submit-login") {
                return;
            }
            
            const loginInput = this.getChildByName('login');
            login(loginInput.value);
        });
    }
}