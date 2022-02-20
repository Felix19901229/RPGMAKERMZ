import { ColorManager } from "../Manager/index.js";
import { Bitmap, Graphics, Sprite } from "../Core/index.js";
//-----------------------------------------------------------------------------
/**
 * Sprite_Timer
 * 
 * The sprite for displaying the timer.
*/
export class Sprite_Timer extends Sprite {
    _seconds: number;
    constructor(...args: any[]) {
        super();
        this.initialize(...args);
    }

    public initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this._seconds = 0;
        this.createBitmap();
        this.update();
    };

    public destroy(options) {
        this.bitmap.destroy();
        Sprite.prototype.destroy.call(this, options);
    };

    public createBitmap() {
        this.bitmap = new Bitmap(96, 48);
        this.bitmap.fontFace = this.fontFace();
        this.bitmap.fontSize = this.fontSize();
        this.bitmap.outlineColor = ColorManager.outlineColor();
    };

    public fontFace() {
        return $gameSystem.numberFontFace();
    };

    public fontSize() {
        return $gameSystem.mainFontSize() + 8;
    };

    public update() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    public updateBitmap() {
        if (this._seconds !== $gameTimer.seconds()) {
            this._seconds = $gameTimer.seconds();
            this.redraw();
        }
    };

    public redraw() {
        const text = this.timerText();
        const width = this.bitmap.width;
        const height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(text, 0, 0, width, height, "center");
    };

    public timerText() {
        const min = Math.floor(this._seconds / 60) % 60;
        const sec = this._seconds % 60;
        return min.padZero(2) + ":" + sec.padZero(2);
    };

    public updatePosition() {
        this.x = (Graphics.width - this.bitmap.width) / 2;
        this.y = 0;
    };

    public updateVisibility() {
        this.visible = $gameTimer.isWorking();
    };

}
