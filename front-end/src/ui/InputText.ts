const CHAR_CODE_A = 65;
const CHAR_CODE_Z = 90;

export interface TextInputConfig {
    x: number,
    y: number,
    maxChars: number,
}

export class TextInput
{
    private isFocused: boolean = false;

    private rawValue: string = "";

    private textDisplay: Phaser.GameObjects.Text

    private maxChars: number;

    private placeholder: string;

    constructor(scene: Phaser.Scene, config: TextInputConfig, textStyle: object, placeholeder = "...")
    {
        this.placeholder = placeholeder;
        this.maxChars = config.maxChars;
        this.textDisplay = scene.add.text(config.x, config.y, placeholeder, textStyle);
        this.textDisplay.setInteractive();
        this.textDisplay.on("pointerdown", () => this.onClick());

        scene.input.keyboard.on('keydown', (event: KeyboardEvent) => this.onKeyDown(event))
        scene.input.on('pointerdown', (event: MouseEvent) => this.onPointerDown(event));
    }

    value(): string
    {
        return this.rawValue;
    }

    private onKeyDown(event: KeyboardEvent) 
    {
        if (!this.isFocused) {
            return;
        }

        const code = event.keyCode;
        const isAlfa = ((code >= CHAR_CODE_A) && (code <= CHAR_CODE_Z)) || event.key === " ";

        if (isAlfa && (this.rawValue.length <= this.maxChars)) {
            console.log(event.key);
            this.rawValue += event.key;
        }

        if (event.key === "Backspace") {
            this.rawValue = this.rawValue.substr(0, this.rawValue.length - 1);
        }

        this.textDisplay.text = this.rawValue + "|"; 
    }

    private onClick()
    {
        console.log('adfadsf');
        if (this.isFocused) {
            return;
        }

        this.isFocused = true;
        this.textDisplay.setAlpha(0.7);
    }

    private onPointerDown(event: MouseEvent)
    {
        const startX = this.textDisplay.x - (this.textDisplay.width);
        const endX = this.textDisplay.x + (this.textDisplay.width);
        const startY = this.textDisplay.y - (this.textDisplay.height);
        const endY = this.textDisplay.y + (this.textDisplay.height);

        console.log(event.x, event.y);

        if (
            (event.x < startX) ||
            (event.x > endX) ||
            (event.y < startY) || 
            (event.y > endY)
        ) {
            if (this.isFocused === false) {
                return;
            }

            this.isFocused = false;
            this.textDisplay.clearAlpha();

            if (this.rawValue === "") {
                this.textDisplay.text = this.placeholder;
            }

        } else {
            this.onClick();
        }
    }
}