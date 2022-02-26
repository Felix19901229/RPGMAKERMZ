import { Input, Rectangle } from "../Core/index.js";
import { TextManager, ConfigManager } from "../Manager/index.js";
import { Sprite_Button } from "../Spriteset/index.js";
import { Window_Selectable } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_ShopNumber
 * 
 * The window for inputting quantity of items to buy or sell on the shop
 * screen.
*/
export class Window_ShopNumber extends Window_Selectable {
    _item: Item;
    _max: number;
    _price: number;
    _number: number;
    _currencyUnit: string;
    _buttons: Sprite_Button[];
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._item = null;
        this._max = 1;
        this._price = 0;
        this._number = 1;
        this._currencyUnit = TextManager.currencyUnit;
        this.createButtons();
        this.select(0);
        this._canRepeat = false;
    };

    public isScrollEnabled() {
        return false;
    };

    public number() {
        return this._number;
    };

    public setup(item, max, price) {
        this._item = item;
        this._max = Math.floor(max);
        this._price = price;
        this._number = 1;
        this.placeButtons();
        this.refresh();
    };

    public setCurrencyUnit(currencyUnit) {
        this._currencyUnit = currencyUnit;
        this.refresh();
    };

    public createButtons() {
        this._buttons = [];
        if (ConfigManager.touchUI) {
            for (const type of ["down2", "down", "up", "up2", "ok"]) {
                const button = new Sprite_Button(type as "down2" | "down" | "up" | "up2" | "ok");
                this._buttons.push(button);
                this.addInnerChild(button);
            }
            this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
            this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
            this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
            this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
            this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
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

    public refresh() {
        Window_Selectable.prototype.refresh.call(this);
        this.drawItemBackground(0);
        this.drawCurrentItemName();
        this.drawMultiplicationSign();
        this.drawNumber();
        this.drawHorzLine();
        this.drawTotalPrice();
    };

    public drawCurrentItemName() {
        const padding = this.itemPadding();
        const x = padding * 2;
        const y = this.itemNameY();
        const width = this.multiplicationSignX() - padding * 3;
        this.drawItemName(this._item, x, y, width);
    };

    public drawMultiplicationSign() {
        const sign = this.multiplicationSign();
        const width = this.textWidth(sign);
        const x = this.multiplicationSignX();
        const y = this.itemNameY();
        this.resetTextColor();
        this.drawText(sign, x, y, width);
    };

    public multiplicationSign() {
        return "\u00d7";
    };

    public multiplicationSignX() {
        const sign = this.multiplicationSign();
        const width = this.textWidth(sign);
        return this.cursorX() - width * 2;
    };

    public drawNumber() {
        const x = this.cursorX();
        const y = this.itemNameY();
        const width = this.cursorWidth() - this.itemPadding();
        this.resetTextColor();
        this.drawText(this._number, x, y, width, "right");
    };

    public drawHorzLine() {
        const padding = this.itemPadding();
        const lineHeight = this.lineHeight();
        const itemY = this.itemNameY();
        const totalY = this.totalPriceY();
        const x = padding;
        const y = Math.floor((itemY + totalY + lineHeight) / 2);
        const width = this.innerWidth - padding * 2;
        this.drawRect(x, y, width, 5);
    };

    public drawTotalPrice() {
        const padding = this.itemPadding();
        const total = this._price * this._number;
        const width = this.innerWidth - padding * 2;
        const y = this.totalPriceY();
        this.drawCurrencyValue(total, this._currencyUnit, 0, y, width);
    };

    public itemNameY() {
        return Math.floor(this.innerHeight / 2 - this.lineHeight() * 1.5);
    };

    public totalPriceY() {
        return Math.floor(this.itemNameY() + this.lineHeight() * 2);
    };

    public buttonY() {
        return Math.floor(this.totalPriceY() + this.lineHeight() * 2);
    };

    public cursorWidth() {
        const padding = this.itemPadding();
        const digitWidth = this.textWidth("0");
        return this.maxDigits() * digitWidth + padding * 2;
    };

    public cursorX() {
        const padding = this.itemPadding();
        return this.innerWidth - this.cursorWidth() - padding * 2;
    };

    public maxDigits() {
        return 2;
    };

    public update() {
        Window_Selectable.prototype.update.call(this);
        this.processNumberChange();
    };

    public playOkSound() {
        //
    };

    public processNumberChange() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated("right")) {
                this.changeNumber(1);
            }
            if (Input.isRepeated("left")) {
                this.changeNumber(-1);
            }
            if (Input.isRepeated("up")) {
                this.changeNumber(10);
            }
            if (Input.isRepeated("down")) {
                this.changeNumber(-10);
            }
        }
    };

    public changeNumber(amount) {
        const lastNumber = this._number;
        this._number = (this._number + amount).clamp(1, this._max);
        if (this._number !== lastNumber) {
            this.playCursorSound();
            this.refresh();
        }
    };

    public itemRect() {
        const rect = new Rectangle();
        rect.x = this.cursorX();
        rect.y = this.itemNameY();
        rect.width = this.cursorWidth();
        rect.height = this.lineHeight();
        return rect;
    };

    public isTouchOkEnabled() {
        return false;
    };

    public onButtonUp() {
        this.changeNumber(1);
    };

    public onButtonUp2() {
        this.changeNumber(10);
    };

    public onButtonDown() {
        this.changeNumber(-1);
    };

    public onButtonDown2() {
        this.changeNumber(-10);
    };

    public onButtonOk() {
        this.processOk();
    };


}
