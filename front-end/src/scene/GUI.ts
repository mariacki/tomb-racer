import Phaser from 'phaser';
import { Turn, EventType, TurnStarted, MovePlayer, CommandType, Position, ItemPicked } from '../../../common';
import { Client } from '../client/Client';
import { State } from './BoardScene';

export class GUI extends Phaser.Scene
{
    private backend: Client = Client.get();
    private turn: Turn;
    private state: State;
    private parent: Phaser.GameObjects.Zone;
    private turnInfoHeader: Phaser.GameObjects.Text;
    private turnInfoText: Phaser.GameObjects.Text;

    constructor(key: string, parent: Phaser.GameObjects.Zone)
    {
        super(key);
        this.parent = parent;
    }

    init(state: State)
    {
        this.state = state;
    }

    create()
    {
        const headerStyle = {
            fixedWidth: this.parent.width - 20,
            fixedHeight: 22,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            fontSize: '20px'
        }  

        const elementStyle = {
            fixedHeight: 22,
            fixedWidth: this.parent.width - 20,
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontSize: '20px'
        }

        this.turnInfoHeader = this.add.text(
            this.parent.x, 
            this.parent.y, 
            "Now playing:", 
            headerStyle
        );

        this.turnInfoText = this.add.text(
            this.parent.x, 
            this.parent.y + 22,
            "N / A" ,
            elementStyle
        )

        const movesLeft = this.add.text(
            this.parent.x,
            this.parent.y + 44,
            "Moves Left:",
            headerStyle
        )

        const movesLeftValue = this.add.text(
            this.parent.x,
            this.parent.y + 66,
            "N / A", 
            elementStyle
        )

        const actionsHeader = this.add.text(
            this.parent.x,
            this.parent.y + 88,
            "Actions: ",
            headerStyle
        )

        const actionsElement = this.add.text(
            this.parent.x,
            this.parent.y + 110,
            "Idź",
            elementStyle
        )

        actionsElement.setAlpha(0.2);

        this.backend.on(EventType.NEXT_TURN, (event: TurnStarted) => {
            const player = this.state.game.players.filter(p => p.userId === event.turn.currentlyPlaying)[0];
            this.turnInfoText.text = player.userName;
            movesLeftValue.text = event.turn.stepPoints.toString();
            actionsElement.removeInteractive();
            actionsElement.setAlpha(0.2);
        })

        this.backend.on(EventType.ITEM_PICKED, (event: ItemPicked) => {
            this.add.sprite(actionsElement.x, actionsElement.y + 50, event.item)
        })

        const emiter = this.scene.get('board').events;

        emiter.on('path-elem-selected', (moves: number) => {
            console.log('Intercepted event');
            movesLeftValue.text = moves.toString(); 
        })

        emiter.on('path-selection-completed', (path: Position[]) => {
            actionsElement.clearAlpha();
            actionsElement.setBackgroundColor("#ff0000");
            actionsElement.setInteractive();
            actionsElement.on('pointerhover', () => actionsElement.setAlpha(0.9));
            actionsElement.on('pointerout', () => actionsElement.clearAlpha());
            actionsElement.on('pointerdown', () =>  {
                this.sendMovement(path)
                actionsElement.removeInteractive();
                actionsElement.removeAllListeners();
                actionsElement.setAlpha(0.2);
            });
        });
    }

    private sendMovement(path: Position[])
    {
        const command: MovePlayer = {
            type: CommandType.MOVE,
            path
        }

        this.backend.send(command);
    }
}