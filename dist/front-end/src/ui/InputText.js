"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CHAR_CODE_A = 65;
const CHAR_CODE_Z = 90;
class TextInput {
    constructor(scene, config, textStyle, placeholeder = "...") {
        this.isFocused = false;
        this.rawValue = "";
        this.placeholder = placeholeder;
        this.maxChars = config.maxChars;
        this.textDisplay = scene.add.text(config.x, config.y, placeholeder, textStyle);
        this.textDisplay.setInteractive();
        this.textDisplay.on("pointerdown", () => this.onClick());
        scene.input.keyboard.on('keydown', (event) => this.onKeyDown(event));
        scene.input.on('pointerdown', (event) => this.onPointerDown(event));
    }
    value() {
        return this.rawValue;
    }
    onKeyDown(event) {
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
    onClick() {
        console.log('adfadsf');
        if (this.isFocused) {
            return;
        }
        this.isFocused = true;
        this.textDisplay.setAlpha(0.7);
    }
    onPointerDown(event) {
        const startX = this.textDisplay.x - (this.textDisplay.width);
        const endX = this.textDisplay.x + (this.textDisplay.width);
        const startY = this.textDisplay.y - (this.textDisplay.height);
        const endY = this.textDisplay.y + (this.textDisplay.height);
        console.log(event.x, event.y);
        if ((event.x < startX) ||
            (event.x > endX) ||
            (event.y < startY) ||
            (event.y > endY)) {
            if (this.isFocused === false) {
                return;
            }
            this.isFocused = false;
            this.textDisplay.clearAlpha();
            if (this.rawValue === "") {
                this.textDisplay.text = this.placeholder;
            }
        }
        else {
            this.onClick();
        }
    }
}
exports.TextInput = TextInput;
//# sourceMappingURL=InputText.js.map