import { Rectangle, Graphics, Input } from "../Core/index.js";
import { ConfigManager } from "../Manager/index.js";
import { Sprite_Button } from "../Spriteset/index.js";
import { Window_Selectable, Window_Message } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_NumberInput
 * 
 * The window used for the event command [Input Number].
*/
export class Window_NumberInput extends Window_Selectable {
    _number: number;
    _maxDigits: number;
    _messageWindow: Window_Message;
    _buttons: Sprite_Button[];
    constructor() {
        const rect = new Rectangle();
        super(rect);
        this.initialize(rect);
    }

    public initialize(rect:Rectangle = new Rectangle()) {
        Window_Selectable.prototype.initialize.call(this,rect);
        this._number = 0;
        this._maxDigits = 1;
        this.openness = 0;
        this.createButtons();
        this.deactivate();
        this._canRepeat = false;
    };

    public setMessageWindow(messageWindow) {
        this._messageWindow = messageWindow;
    };

    public start() {
        this._maxDigits = window.$gameMessage.numInputMaxDigits();
        this._number = window.$gameVariables.value(window.$gameMessage.numInputVariableId());
        this._number = this._number.clamp(0, Math.pow(10, this._maxDigits) - 1);
        this.updatePlacement();
        this.placeButtons();
        this.createContents();
        this.refresh();
        this.open();
        this.activate();
        this.select(0);
    };

    public updatePlacement() {
        const messageY = this._messageWindow.y;
        const spacing = 8;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        this.x = (Graphics.boxWidth - this.width) / 2;
        if (messageY >= Graphics.boxHeight / 2) {
            this.y = messageY - this.height - spacing;
        } else {
            this.y = messageY + this._messageWindow.height + spacing;
        }
    };

    public windowWidth() {
        const totalItemWidth = this.maxCols() * this.itemWidth();
        const totalButtonWidth = this.totalButtonWidth();
        return Math.max(totalItemWidth, totalButtonWidth) + this.padding * 2;
    };

    public windowHeight() {
        if (ConfigManager.touchUI) {
            return this.fittingHeight(1) + this.buttonSpacing() + 48;
        } else {
            return this.fittingHeight(1);
        }
    };

    public maxCols() {
        return this._maxDigits;
    };

    public maxItems() {
        return this._maxDigits;
    };

    public itemWidth() {
        return 48;
    };

    public itemRect(index) {
        const rect = Window_Selectable.prototype.itemRect.call(this, index);
        const innerMargin = this.innerWidth - this.maxCols() * this.itemWidth();
        rect.x += innerMargin / 2;
        return rect;
    };

    public isScrollEnabled() {
        return false;
    };

    public isHoverEnabled() {
        return false;
    };

    public createButtons() {
        this._buttons = [];
        if (ConfigManager.touchUI) {
            for (const type of ["down", "up", "ok"]) {
                const button = new Sprite_Button(type as "down" | "up" | "ok");
                this._buttons.push(button);
                this.addInnerChild(button);
            }
            this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
            this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
            this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
        }
    };

    public placeButtons() {
        const sp = this.buttonSpacing();
        const totalWidth = this.totalButtonWidth();
        let x = (this.innerWidth - totalWidth) / 2;
        for (const button of this._buttons) {
            button.x = x;
            button.y = this.buttonY();
            x += button.width + sp;
        }
    };

    public totalButtonWidth() {
        const sp = this.buttonSpacing();
        return this._buttons.reduce((r, button) => r + button.width + sp, -sp);
    };

    public buttonSpacing() {
        return 8;
    };

    public buttonY() {
        return this.itemHeight() + this.buttonSpacing();
    };

    public update() {
        Window_Selectable.prototype.update.call(this);
        this.processDigitChange();
    };

    public processDigitChange() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated("up")) {
                this.changeDigit(true);
            } else if (Input.isRepeated("down")) {
                this.changeDigit(false);
            }
        }
    };

    public changeDigit(up) {
        const index = this.index();
        const place = Math.pow(10, this._maxDigits - 1 - index);
        let n = Math.floor(this._number / place) % 10;
        this._number -= n * place;
        if (up) {
            n = (n + 1) % 10;
        } else {
            n = (n + 9) % 10;
        }
        this._number += n * place;
        this.refresh();
        this.playCursorSound();
    };

    public isTouchOkEnabled() {
        return false;
    };

    public isOkEnabled() {
        return true;
    };

    public isCancelEnabled() {
        return false;
    };

    public processOk() {
        this.playOkSound();
        window.$gameVariables.setValue(window.$gameMessage.numInputVariableId(), this._number);
        this._messageWindow.terminateMessage();
        this.updateInputData();
        this.deactivate();
        this.close();
    };

    public drawItem(index) {
        const rect = this.itemLineRect(index);
        const align = "center";
        const s = this._number.padZero(this._maxDigits);
        const c = s.slice(index, index + 1);
        this.resetTextColor();
        this.drawText(c, rect.x, rect.y, rect.width, align);
    };

    public onButtonUp() {
        this.changeDigit(true);
    };

    public onButtonDown() {
        this.changeDigit(false);
    };

    public onButtonOk() {
        this.processOk();
    };

}
