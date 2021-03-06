import { Game_Actor } from "../Game/index.js";
import { ImageManager } from "../Manager/index.js";
import { Sprite } from "../Core/index.js";

//-----------------------------------------------------------------------------
/**
 * Sprite_StateOverlay
 * 
 * The sprite for displaying an overlay image for a state.
*/
export class Sprite_StateOverlay extends Sprite {
    _battler: Nullable<Game_Actor>;
    _overlayIndex: number;
    _animationCount: number;
    _pattern: number;
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
        this._battler = null;
        this._overlayIndex = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    };

    public loadBitmap() {
        this.bitmap = ImageManager.loadSystem("States");
        this.setFrame(0, 0, 0, 0);
    };

    public setup(battler) {
        this._battler = battler;
    };

    public update() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    };

    public animationWait() {
        return 8;
    };

    public updatePattern() {
        this._pattern++;
        this._pattern %= 8;
        if (this._battler) {
            this._overlayIndex = this._battler.stateOverlayIndex();
        } else {
            this._overlayIndex = 0;
        }
    };

    public updateFrame() {
        if (this._overlayIndex > 0) {
            const w = 96;
            const h = 96;
            const sx = this._pattern * w;
            const sy = (this._overlayIndex - 1) * h;
            this.setFrame(sx, sy, w, h);
        } else {
            this.setFrame(0, 0, 0, 0);
        }
    };
}
