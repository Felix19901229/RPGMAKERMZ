import { ColorManager } from "../Manager/index.js";
import { Bitmap, Graphics, Sprite } from "../Core/index.js";
export class Sprite_Timer extends Sprite {
    _seconds;
    constructor(...args) {
        super();
        this.initialize(...args);
    }
    initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this._seconds = 0;
        this.createBitmap();
        this.update();
    }
    ;
    destroy(options) {
        this.bitmap.destroy();
        Sprite.prototype.destroy.call(this, options);
    }
    ;
    createBitmap() {
        this.bitmap = new Bitmap(96, 48);
        this.bitmap.fontFace = this.fontFace();
        this.bitmap.fontSize = this.fontSize();
        this.bitmap.outlineColor = ColorManager.outlineColor();
    }
    ;
    fontFace() {
        return $gameSystem.numberFontFace();
    }
    ;
    fontSize() {
        return $gameSystem.mainFontSize() + 8;
    }
    ;
    update() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    }
    ;
    updateBitmap() {
        if (this._seconds !== $gameTimer.seconds()) {
            this._seconds = $gameTimer.seconds();
            this.redraw();
        }
    }
    ;
    redraw() {
        const text = this.timerText();
        const width = this.bitmap.width;
        const height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(text, 0, 0, width, height, "center");
    }
    ;
    timerText() {
        const min = Math.floor(this._seconds / 60) % 60;
        const sec = this._seconds % 60;
        return min.padZero(2) + ":" + sec.padZero(2);
    }
    ;
    updatePosition() {
        this.x = (Graphics.width - this.bitmap.width) / 2;
        this.y = 0;
    }
    ;
    updateVisibility() {
        this.visible = $gameTimer.isWorking();
    }
    ;
}
