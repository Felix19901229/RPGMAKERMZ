import { AudioManager, ImageManager } from "../Manager/index.js";
import { Bitmap, ScreenSprite, Sprite } from "../Core/index.js";
import { Game_Actor } from "../Game/index.js";
//-----------------------------------------------------------------------------
/**
 * Sprite_AnimationMV
 * 
 * The sprite for displaying an old format animation.
*/
export class Sprite_AnimationMV extends Sprite {
    _targets: null[];
    _animation: Animate;
    _mirror: boolean;
    _delay: number;
    _rate: number;
    _duration: number;
    _flashColor: number[];
    _flashDuration: number;
    _screenFlashDuration: number;
    _hidingDuration: number;
    _hue1: number;
    _hue2: number;
    _bitmap1: Bitmap;
    _bitmap2: Bitmap;
    _cellSprites: Sprite[];
    _screenFlashSprite: ScreenSprite;
    targetObjects:Nullable<Game_Actor>;
    declare parent: Nullable<Sprite_AnimationMV>;
    constructor(...args) {
        super();
        this.initialize(...args);
    }

    public initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
    };

    public initMembers() {
        this._targets = [];
        this._animation = null;
        this._mirror = false;
        this._delay = 0;
        this._rate = 4;
        this._duration = 0;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._screenFlashDuration = 0;
        this._hidingDuration = 0;
        this._hue1 = 0;
        this._hue2 = 0;
        this._bitmap1 = null;
        this._bitmap2 = null;
        this._cellSprites = [];
        this._screenFlashSprite = null;
        this.z = 8;
    };

    public setup(targets, animation, mirror, delay) {
        console.log(targets, animation, mirror, delay, "_targets")
        this._targets = targets;
        this._animation = animation;
        this._mirror = mirror;
        this._delay = delay;
        if (this._animation) {
            this.setupRate();
            this.setupDuration();
            this.loadBitmaps();
            this.createCellSprites();
            this.createScreenFlashSprite();
        }
    };

    public setupRate() {
        this._rate = 4;
    };

    public setupDuration() {
        this._duration = this._animation.frames.length * this._rate + 1;
    };

    public update() {
        Sprite.prototype.update.call(this);
        this.updateMain();
        this.updateFlash();
        this.updateScreenFlash();
        this.updateHiding();
    };

    public updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            for (const target of this._targets) {
                target.setBlendColor(this._flashColor);
            }
        }
    };

    public updateScreenFlash() {
        if (this._screenFlashDuration > 0) {
            const d = this._screenFlashDuration--;
            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                this._screenFlashSprite.opacity *= (d - 1) / d;
                this._screenFlashSprite.visible = this._screenFlashDuration > 0;
            }
        }
    };

    public absoluteX() {
        let x = 0;
        let object: Sprite_AnimationMV = this;
        while (object) {
            x += object.x;
            object = object.parent;
        }
        return x;
    };

    public absoluteY() {
        let y = 0;
        let object: Sprite_AnimationMV = this;
        while (object) {
            y += object.y;
            object = object.parent;
        }
        return y;
    };

    public updateHiding() {
        if (this._hidingDuration > 0) {
            this._hidingDuration--;
            if (this._hidingDuration === 0) {
                for (const target of this._targets) {
                    target.show();
                }
            }
        }
    };

    public isPlaying() {
        return this._duration > 0;
    };

    public loadBitmaps() {
        const name1 = this._animation.animation1Name;
        const name2 = this._animation.animation2Name;
        this._hue1 = this._animation.animation1Hue;
        this._hue2 = this._animation.animation2Hue;
        console.log(this._animation.animation1Name, this._animation.animation2Name, this._animation.animation1Hue, this._animation.animation2Hue,'animation2Hue');
        this._bitmap1 = ImageManager.loadAnimation(name1);
        this._bitmap2 = ImageManager.loadAnimation(name2);
    };

    public isReady() {
        return (
            this._bitmap1 &&
            this._bitmap1.isReady() &&
            this._bitmap2 &&
            this._bitmap2.isReady()
        );
    };

    public createCellSprites() {
        this._cellSprites = [];
        for (let i = 0; i < 16; i++) {
            const sprite = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this._cellSprites.push(sprite);
            this.addChild(sprite);
        }
    };

    public createScreenFlashSprite() {
        this._screenFlashSprite = new ScreenSprite();
        this.addChild(this._screenFlashSprite);
    };

    public updateMain() {
        if (this.isPlaying() && this.isReady()) {
            if (this._delay > 0) {
                this._delay--;
            } else {
                this._duration--;
                this.updatePosition();
                if (this._duration % this._rate === 0) {
                    this.updateFrame();
                }
                if (this._duration <= 0) {
                    this.onEnd();
                }
            }
        }
    };

    public updatePosition() {
        if (this._animation.position === 3) {
            this.x = this.parent.width / 2;
            this.y = this.parent.height / 2;
        } else if (this._targets.length > 0) {
            const target = this._targets[0];
            const parent = target.parent;
            const grandparent = parent ? parent.parent : null;
            this.x = target.x;
            this.y = target.y;
            if (this.parent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }
            if (this._animation.position === 0) {
                this.y -= target.height;
            } else if (this._animation.position === 1) {
                this.y -= target.height / 2;
            }
        }
    };

    public updateFrame() {
        if (this._duration > 0) {
            const frameIndex = this.currentFrameIndex();
            this.updateAllCellSprites(this._animation.frames[frameIndex]);
            for (const timing of this._animation.timings) {
                if (timing.frame === frameIndex) {
                    this.processTimingData(timing);
                }
            }
        }
    };

    public currentFrameIndex() {
        return (
            this._animation.frames.length -
            Math.floor((this._duration + this._rate - 1) / this._rate)
        );
    };

    public updateAllCellSprites(frame) {
        if (this._targets.length > 0) {
            for (let i = 0; i < this._cellSprites.length; i++) {
                const sprite = this._cellSprites[i];
                if (i < frame.length) {
                    this.updateCellSprite(sprite, frame[i]);
                } else {
                    sprite.visible = false;
                }
            }
        }
    };

    public updateCellSprite(sprite, cell) {
        const pattern = cell[0];
        if (pattern >= 0) {
            const sx = (pattern % 5) * 192;
            const sy = Math.floor((pattern % 100) / 5) * 192;
            const mirror = this._mirror;
            sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
            sprite.setHue(pattern < 100 ? this._hue1 : this._hue2);
            sprite.setFrame(sx, sy, 192, 192);
            sprite.x = cell[1];
            sprite.y = cell[2];
            sprite.rotation = (cell[4] * Math.PI) / 180;
            sprite.scale.x = cell[3] / 100;

            if (cell[5]) {
                sprite.scale.x *= -1;
            }
            if (mirror) {
                sprite.x *= -1;
                sprite.rotation *= -1;
                sprite.scale.x *= -1;
            }

            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        } else {
            sprite.visible = false;
        }
    };

    public processTimingData(timing) {
        const duration = timing.flashDuration * this._rate;
        switch (timing.flashScope) {
            case 1:
                this.startFlash(timing.flashColor, duration);
                break;
            case 2:
                this.startScreenFlash(timing.flashColor, duration);
                break;
            case 3:
                this.startHiding(duration);
                break;
        }
        if (timing.se) {
            AudioManager.playSe(timing.se);
        }
    };

    public startFlash(color, duration) {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    };

    public startScreenFlash(color, duration) {
        this._screenFlashDuration = duration;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.setColor(color[0], color[1], color[2]);
            this._screenFlashSprite.opacity = color[3];
        }
    };

    public startHiding(duration) {
        this._hidingDuration = duration;
        for (const target of this._targets) {
            target.hide();
        }
    };

    public onEnd() {
        this._flashDuration = 0;
        this._screenFlashDuration = 0;
        this._hidingDuration = 0;
        for (const target of this._targets) {
            target.setBlendColor([0, 0, 0, 0]);
            target.show();
        }
    };
}
