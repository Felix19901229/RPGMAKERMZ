import { Game_Actor } from "../Game/index.js";
import { ImageManager } from "../Manager/index.js";
import { Sprite } from "../Core/index.js";
//-----------------------------------------------------------------------------
/**
 * Sprite_StateIcon
 * 
 * The sprite for displaying state icons.
*/
export class Sprite_StateIcon extends Sprite {
    _battler: Game_Actor;
    _iconIndex: number;
    _animationCount: number;
    _animationIndex: number;
    constructor(...args: []) {
        super();
        this.initialize(...args);
    }


    public initialize() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };

    public initMembers() {
        this._battler = null;
        this._iconIndex = 0;
        this._animationCount = 0;
        this._animationIndex = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };

    public loadBitmap() {
        this.bitmap = ImageManager.loadSystem("IconSet");
        this.setFrame(0, 0, 0, 0);
    };

    public setup(battler) {
        if (this._battler !== battler) {
            this._battler = battler;
            this._animationCount = this.animationWait();
        }
    };

    public update() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this.updateFrame();
            this._animationCount = 0;
        }
    };

    public animationWait() {
        return 40;
    };

    public updateIcon() {
        const icons = [];
        if (this.shouldDisplay()) {
            icons.push(...this._battler.allIcons());
        }
        if (icons.length > 0) {
            this._animationIndex++;
            if (this._animationIndex >= icons.length) {
                this._animationIndex = 0;
            }
            this._iconIndex = icons[this._animationIndex];
        } else {
            this._animationIndex = 0;
            this._iconIndex = 0;
        }
    };

    public shouldDisplay() {
        const battler = this._battler;
        return battler && (battler.isActor() || battler.isAlive());
    };

    public updateFrame() {
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (this._iconIndex % 16) * pw;
        const sy = Math.floor(this._iconIndex / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    };
}