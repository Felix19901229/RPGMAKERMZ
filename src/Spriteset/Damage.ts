import { ColorManager } from "../Manager/index.js";
import { Bitmap, Sprite } from "../Core/index.js";
//-----------------------------------------------------------------------------
/**
 * Sprite_Damage
 * 
 * The sprite for displaying a popup damage.
*/
export class Sprite_Damage extends Sprite {
    _duration: number;
    _flashColor: [number, number, number, number];
    _flashDuration: number;
    _colorType: number;
    constructor(...args: any[]) {
        super();
        this.initialize(...args);

    }


    public initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this._duration = 90;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._colorType = 0;
    };

    public destroy(options) {
        for (const child of this.children) {
            if (child.bitmap) {
                child.bitmap.destroy();
            }
        }
        Sprite.prototype.destroy.call(this, options);
    };

    public setup(target) {
        const result = target.result();
        if (result.missed || result.evaded) {
            this._colorType = 0;
            this.createMiss();
        } else if (result.hpAffected) {
            this._colorType = result.hpDamage >= 0 ? 0 : 1;
            this.createDigits(result.hpDamage);
        } else if (target.isAlive() && result.mpDamage !== 0) {
            this._colorType = result.mpDamage >= 0 ? 2 : 3;
            this.createDigits(result.mpDamage);
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
    };

    public setupCriticalEffect() {
        this._flashColor = [255, 0, 0, 160];
        this._flashDuration = 60;
    };

    public fontFace() {
        return $gameSystem.numberFontFace();
    };

    public fontSize() {
        return $gameSystem.mainFontSize() + 4;
    };

    public damageColor() {
        return ColorManager.damageColor(this._colorType);
    };

    public outlineColor() {
        return "rgba(0, 0, 0, 0.7)";
    };

    public outlineWidth() {
        return 4;
    };

    public createMiss() {
        const h = this.fontSize();
        const w = Math.floor(h * 3.0);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText("Miss", 0, 0, w, h, "center");
        sprite.dy = 0;
    };

    public createDigits(value) {
        const string = Math.abs(value).toString();
        const h = this.fontSize();
        const w = Math.floor(h * 0.75);
        for (let i = 0; i < string.length; i++) {
            const sprite = this.createChildSprite(w, h);
            sprite.bitmap.drawText(string[i], 0, 0, w, h, "center");
            sprite.x = (i - (string.length - 1) / 2) * w;
            sprite.dy = -i;
        }
    };

    public createChildSprite(width, height) {
        const sprite = new Sprite();
        sprite.bitmap = this.createBitmap(width, height);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        this.addChild(sprite);
        return sprite;
    };

    public createBitmap(width, height) {
        const bitmap = new Bitmap(width, height);
        bitmap.fontFace = this.fontFace();
        bitmap.fontSize = this.fontSize();
        bitmap.textColor = this.damageColor();
        bitmap.outlineColor = this.outlineColor();
        bitmap.outlineWidth = this.outlineWidth();
        return bitmap;
    };

    public update() {
        Sprite.prototype.update.call(this);
        if (this._duration > 0) {
            this._duration--;
            for (const child of this.children) {
                this.updateChild(child);
            }
        }
        this.updateFlash();
        this.updateOpacity();
    };

    public updateChild(sprite) {
        sprite.dy += 0.5;
        sprite.ry += sprite.dy;
        if (sprite.ry >= 0) {
            sprite.ry = 0;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    };

    public updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
        }
    };

    public updateOpacity() {
        if (this._duration < 10) {
            this.opacity = (255 * this._duration) / 10;
        }
    };

    public isPlaying() {
        return this._duration > 0;
    };
}
