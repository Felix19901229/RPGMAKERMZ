import { ImageManager } from "../Manager/index.js";
import { Sprite } from "../Core/index.js";
//-----------------------------------------------------------------------------
/**
 * Sprite_Balloon
 * 
 * The sprite for displaying a balloon icon.
*/
export class Sprite_Balloon extends Sprite {
    _target: Nullable<Sprite>;
    _balloonId: number;
    _duration: number;
    targetObject: ReturnType<typeof $gameTemp.retrieveBalloon>;
    constructor(...args: any[]) {
        super();
        this.initialize(...args);
    }

    public initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };

    public initMembers() {
        this._target = null;
        this._balloonId = 0;
        this._duration = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.z = 7;
    };

    public loadBitmap() {
        this.bitmap = ImageManager.loadSystem("Balloon");
        this.setFrame(0, 0, 0, 0);
    };

    public setup(targetSprite, balloonId) {
        this._target = targetSprite;
        this._balloonId = balloonId;
        this._duration = 8 * this.speed() + this.waitTime();
    };

    public update() {
        Sprite.prototype.update.call(this);
        if (this._duration > 0) {
            this._duration--;
            if (this._duration > 0) {
                this.updatePosition();
                this.updateFrame();
            }
        }
    };

    public updatePosition() {
        this.x = this._target.x;
        this.y = this._target.y - this._target.height;
    };

    public updateFrame() {
        const w = 48;
        const h = 48;
        const sx = this.frameIndex() * w;
        const sy = (this._balloonId - 1) * h;
        this.setFrame(sx, sy, w, h);
    };

    public speed() {
        return 8;
    };

    public waitTime() {
        return 12;
    };

    public frameIndex() {
        const index = (this._duration - this.waitTime()) / this.speed();
        return 7 - Math.max(Math.floor(index), 0);
    };

    public isPlaying() {
        return this._duration > 0;
    };
}
