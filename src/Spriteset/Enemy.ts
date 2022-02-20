import { ImageManager, SoundManager } from "../Manager/index.js";
import { Game_Actor, Game_Enemy } from "../Game/index.js";
import { Sprite_Battler, Sprite_StateIcon } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Sprite_Enemy
 * 
 * The sprite for displaying an enemy.
*/
export class Sprite_Enemy extends Sprite_Battler {
    _enemy: Nullable<Game_Enemy>;
    _appeared: boolean;
    _battlerName: string;
    _battlerHue: number;
    _effectType: null;
    _effectDuration: number;
    _shake: number;
    _stateIconSprite: Nullable<Sprite_StateIcon>;
    constructor(...args: [Game_Actor]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(battler:Game_Actor) {
        Sprite_Battler.prototype.initialize.call(this, battler);
    };

    public initMembers() {
        Sprite_Battler.prototype.initMembers.call(this);
        this._enemy = null;
        this._appeared = false;
        this._battlerName = "";
        this._battlerHue = 0;
        this._effectType = null;
        this._effectDuration = 0;
        this._shake = 0;
        this.createStateIconSprite();
    };

    public createStateIconSprite() {
        this._stateIconSprite = new Sprite_StateIcon();
        this.addChild(this._stateIconSprite);
    };

    public setBattler(battler) {
        Sprite_Battler.prototype.setBattler.call(this, battler);
        this._enemy = battler;
        this.setHome(battler.screenX(), battler.screenY());
        this._stateIconSprite.setup(battler);
    };

    public update() {
        Sprite_Battler.prototype.update.call(this);
        if (this._enemy) {
            this.updateEffect();
            this.updateStateSprite();
        }
    };

    public updateBitmap() {
        Sprite_Battler.prototype.updateBitmap.call(this);
        const name = this._enemy.battlerName();
        const hue = this._enemy.battlerHue();
        if (this._battlerName !== name || this._battlerHue !== hue) {
            this._battlerName = name;
            this._battlerHue = hue;
            this.loadBitmap(name);
            this.setHue(hue);
            this.initVisibility();
        }
    };

    public loadBitmap(name) {
        if ($gameSystem.isSideView()) {
            this.bitmap = ImageManager.loadSvEnemy(name);
        } else {
            this.bitmap = ImageManager.loadEnemy(name);
        }
    };

    public setHue(hue) {
        Sprite_Battler.prototype.setHue.call(this, hue);
        for (const child of this.children) {
            if (child.setHue) {
                child.setHue(-hue);
            }
        }
    };

    public updateFrame() {
        Sprite_Battler.prototype.updateFrame.call(this);
        if (this._effectType === "bossCollapse") {
            this.setFrame(0, 0, this.bitmap.width, this._effectDuration);
        } else {
            this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
        }
    };

    public updatePosition() {
        Sprite_Battler.prototype.updatePosition.call(this);
        this.x += this._shake;
    };

    public updateStateSprite() {
        this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
        if (this._stateIconSprite.y < 20 - this.y) {
            this._stateIconSprite.y = 20 - this.y;
        }
    };

    public initVisibility() {
        this._appeared = this._enemy.isAlive();
        if (!this._appeared) {
            this.opacity = 0;
        }
    };

    public setupEffect() {
        if (this._appeared && this._enemy.isEffectRequested()) {
            this.startEffect(this._enemy.effectType());
            this._enemy.clearEffect();
        }
        if (!this._appeared && this._enemy.isAlive()) {
            this.startEffect("appear");
        } else if (this._appeared && this._enemy.isHidden()) {
            this.startEffect("disappear");
        }
    };

    public startEffect(effectType) {
        this._effectType = effectType;
        switch (this._effectType) {
            case "appear":
                this.startAppear();
                break;
            case "disappear":
                this.startDisappear();
                break;
            case "whiten":
                this.startWhiten();
                break;
            case "blink":
                this.startBlink();
                break;
            case "collapse":
                this.startCollapse();
                break;
            case "bossCollapse":
                this.startBossCollapse();
                break;
            case "instantCollapse":
                this.startInstantCollapse();
                break;
        }
        this.revertToNormal();
    };

    public startAppear() {
        this._effectDuration = 16;
        this._appeared = true;
    };

    public startDisappear() {
        this._effectDuration = 32;
        this._appeared = false;
    };

    public startWhiten() {
        this._effectDuration = 16;
    };

    public startBlink() {
        this._effectDuration = 20;
    };

    public startCollapse() {
        this._effectDuration = 32;
        this._appeared = false;
    };

    public startBossCollapse() {
        this._effectDuration = this.bitmap.height;
        this._appeared = false;
    };

    public startInstantCollapse() {
        this._effectDuration = 16;
        this._appeared = false;
    };

    public updateEffect() {
        this.setupEffect();
        if (this._effectDuration > 0) {
            this._effectDuration--;
            switch (this._effectType) {
                case "whiten":
                    this.updateWhiten();
                    break;
                case "blink":
                    this.updateBlink();
                    break;
                case "appear":
                    this.updateAppear();
                    break;
                case "disappear":
                    this.updateDisappear();
                    break;
                case "collapse":
                    this.updateCollapse();
                    break;
                case "bossCollapse":
                    this.updateBossCollapse();
                    break;
                case "instantCollapse":
                    this.updateInstantCollapse();
                    break;
            }
            if (this._effectDuration === 0) {
                this._effectType = null;
            }
        }
    };

    public isEffecting() {
        return this._effectType !== null;
    };

    public revertToNormal() {
        this._shake = 0;
        this.blendMode = 0;
        this.opacity = 255;
        this.setBlendColor([0, 0, 0, 0]);
    };

    public updateWhiten() {
        const alpha = 128 - (16 - this._effectDuration) * 10;
        this.setBlendColor([255, 255, 255, alpha]);
    };

    public updateBlink() {
        this.opacity = this._effectDuration % 10 < 5 ? 255 : 0;
    };

    public updateAppear() {
        this.opacity = (16 - this._effectDuration) * 16;
    };

    public updateDisappear() {
        this.opacity = 256 - (32 - this._effectDuration) * 10;
    };

    public updateCollapse() {
        this.blendMode = 1;
        this.setBlendColor([255, 128, 128, 128]);
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
    };

    public updateBossCollapse() {
        this._shake = (this._effectDuration % 2) * 4 - 2;
        this.blendMode = 1;
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        if (this._effectDuration % 20 === 19) {
            SoundManager.playBossCollapse2();
        }
    };

    public updateInstantCollapse() {
        this.opacity = 0;
    };

    public damageOffsetX() {
        return Sprite_Battler.prototype.damageOffsetX.call(this);
    };

    public damageOffsetY() {
        return Sprite_Battler.prototype.damageOffsetY.call(this) - 8;
    };
}
