import { ColorManager } from "src/Manager/index.js";
import { Bitmap, Sprite } from "../Core/index.js";

//-----------------------------------------------------------------------------
/**
 * Sprite_Name
 * 
 *  The sprite for displaying a status gauge.
*/
export class Sprite_Name extends Sprite {
    _battler: any;
    _name: string;
    _textColor: string;
    constructor(...args: any[]) {
        super();
        delete this.name;
        this.initialize(...args);
    }

    public initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.createBitmap();
    };

    public initMembers() {
        this._battler = null;
        this._name = "";
        this._textColor = "";
    };

    public destroy(options) {
        this.bitmap.destroy();
        Sprite.prototype.destroy.call(this, options);
    };

    public createBitmap() {
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.bitmap = new Bitmap(width, height);
    };

    public bitmapWidth() {
        return 128;
    };

    public bitmapHeight() {
        return 24;
    };

    public fontFace() {
        return $gameSystem.mainFontFace();
    };

    public fontSize() {
        return $gameSystem.mainFontSize();
    };

    public setup(battler) {
        this._battler = battler;
        this.updateBitmap();
    };

    public update() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
    };

    public updateBitmap() {
        const name = this.name();
        const color = this.textColor();
        if (name !== this._name || color !== this._textColor) {
            this._name = name;
            this._textColor = color;
            this.redraw();
        }
    };
    //@ts-ignore
    public name() {
        return this._battler ? this._battler.name() : "";
    };

    public textColor() {
        return ColorManager.hpColor(this._battler);
    };

    public outlineColor() {
        return ColorManager.outlineColor();
    };

    public outlineWidth() {
        return 3;
    };

    public redraw() {
        const name = this.name();
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupFont();
        this.bitmap.clear();
        this.bitmap.drawText(name, 0, 0, width, height, "left");
    };

    public setupFont() {
        this.bitmap.fontFace = this.fontFace();
        this.bitmap.fontSize = this.fontSize();
        this.bitmap.textColor = this.textColor();
        this.bitmap.outlineColor = this.outlineColor();
        this.bitmap.outlineWidth = this.outlineWidth();
    };
}
