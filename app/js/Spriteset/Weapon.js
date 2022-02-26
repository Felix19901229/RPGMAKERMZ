import { Sprite } from "../Core/index.js";
import { ImageManager } from "../Manager/index.js";
export class Sprite_Weapon extends Sprite {
    _weaponImageId;
    _animationCount;
    _pattern;
    constructor(...args) {
        super();
        this.initialize(...args);
    }
    initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
    }
    ;
    initMembers() {
        this._weaponImageId = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.x = -16;
    }
    ;
    setup(weaponImageId) {
        this._weaponImageId = weaponImageId;
        this._animationCount = 0;
        this._pattern = 0;
        this.loadBitmap();
        this.updateFrame();
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
        return 12;
    }
    ;
    updatePattern() {
        this._pattern++;
        if (this._pattern >= 3) {
            this._weaponImageId = 0;
        }
    }
    ;
    loadBitmap() {
        const pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
        if (pageId >= 1) {
            this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
        }
        else {
            this.bitmap = ImageManager.loadSystem("");
        }
    }
    ;
    updateFrame() {
        if (this._weaponImageId > 0) {
            const index = (this._weaponImageId - 1) % 12;
            const w = 96;
            const h = 64;
            const sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
            const sy = Math.floor(index % 6) * h;
            this.setFrame(sx, sy, w, h);
        }
        else {
            this.setFrame(0, 0, 0, 0);
        }
    }
    ;
    isPlaying() {
        return this._weaponImageId > 0;
    }
    ;
}
