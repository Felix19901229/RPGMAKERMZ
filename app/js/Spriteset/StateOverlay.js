import { ImageManager } from "../Manager/index.js";
import { Sprite } from "../Core/index.js";
export class Sprite_StateOverlay extends Sprite {
    _battler;
    _overlayIndex;
    _animationCount;
    _pattern;
    constructor(...args) {
        super();
        this.initialize(...args);
    }
    initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    }
    ;
    initMembers() {
        this._battler = null;
        this._overlayIndex = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }
    ;
    loadBitmap() {
        this.bitmap = ImageManager.loadSystem("States");
        this.setFrame(0, 0, 0, 0);
    }
    ;
    setup(battler) {
        this._battler = battler;
    }
    ;
    update() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    }
    ;
    animationWait() {
        return 8;
    }
    ;
    updatePattern() {
        this._pattern++;
        this._pattern %= 8;
        if (this._battler) {
            this._overlayIndex = this._battler.stateOverlayIndex();
        }
        else {
            this._overlayIndex = 0;
        }
    }
    ;
    updateFrame() {
        if (this._overlayIndex > 0) {
            const w = 96;
            const h = 96;
            const sx = this._pattern * w;
            const sy = (this._overlayIndex - 1) * h;
            this.setFrame(sx, sy, w, h);
        }
        else {
            this.setFrame(0, 0, 0, 0);
        }
    }
    ;
}
