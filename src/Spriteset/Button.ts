import { Input, Rectangle } from "../Core/index.js";
import { ImageManager } from "../Manager/index.js";
import { Sprite_Clickable } from "./index.js";
type ButtonType="cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu";
//-----------------------------------------------------------------------------
/**
 * Sprite_Button
 * 
 * The sprite for displaying a button.
*/
export class Sprite_Button extends Sprite_Clickable {
    _buttonType: ButtonType;
    _clickHandler: Function;
    _coldFrame: Rectangle;
    _hotFrame: Rectangle;
    constructor(...args: [ButtonType]) {
        super(...args);
        this.initialize(...args);
    }
    public initialize(buttonType) {
        Sprite_Clickable.prototype.initialize.call(this);
        this._buttonType = buttonType;
        this._clickHandler = null;
        this._coldFrame = null;
        this._hotFrame = null;
        this.setupFrames();
    };
    public setupFrames() {
        const data = this.buttonData();
        const x = data.x * this.blockWidth();
        const width = data.w * this.blockWidth();
        const height = this.blockHeight();
        this.loadButtonImage();
        this.setColdFrame(x, 0, width, height);
        this.setHotFrame(x, height, width, height);
        this.updateFrame();
        this.updateOpacity();
    };
    public blockWidth() {
        return 48;
    };
    public blockHeight() {
        return 48;
    };
    public loadButtonImage() {
        this.bitmap = ImageManager.loadSystem("ButtonSet");
    };
    public buttonData() {
        const buttonTable = {
            cancel: { x: 0, w: 2 },
            pageup: { x: 2, w: 1 },
            pagedown: { x: 3, w: 1 },
            down: { x: 4, w: 1 },
            up: { x: 5, w: 1 },
            down2: { x: 6, w: 1 },
            up2: { x: 7, w: 1 },
            ok: { x: 8, w: 2 },
            menu: { x: 10, w: 1 }
        };
        return buttonTable[this._buttonType];
    };
    public update() {
        Sprite_Clickable.prototype.update.call(this);
        this.checkBitmap();
        this.updateFrame();
        this.updateOpacity();
        this.processTouch();
    };
    public checkBitmap() {
        if (this.bitmap.isReady() && this.bitmap.width < this.blockWidth() * 11) {
            // Probably MV image is used
            throw new Error("ButtonSet image is too small");
        }
    };
    public updateFrame() {
        const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    };
    public updateOpacity() {
        this.opacity = this._pressed ? 255 : 192;
    };
    public setColdFrame(x, y, width, height) {
        this._coldFrame = new Rectangle(x, y, width, height);
    };
    public setHotFrame(x, y, width, height) {
        this._hotFrame = new Rectangle(x, y, width, height);
    };
    public setClickHandler(method) {
        this._clickHandler = method;
    };
    public onClick() {
        if (this._clickHandler) {
            this._clickHandler();
        } else {
            Input.virtualClick(this._buttonType);
        }
    };
}
