import { Sprite } from "../Core/index.js";
import { Game_Actor} from "../Game/index.js";
import { Sprite_Clickable,Sprite_Damage } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Sprite_Battler
 * 
 * The superclass of Sprite_Actor and Sprite_Enemy.
*/
export class Sprite_Battler extends Sprite_Clickable {
    _battler: Nullable<Game_Actor>;
    _damages: Sprite_Damage[];
    _homeX: number;
    _homeY: number;
    _offsetX: number;
    _offsetY: number;
    _targetOffsetX: number;
    _targetOffsetY: number;
    _movementDuration: number;
    _selectionEffectCount: number;
    constructor(...args: [Game_Actor]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(battler) {
        Sprite_Clickable.prototype.initialize.call(this);
        this.initMembers();
        this.setBattler(battler);
    };

    public initMembers() {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._battler = null;
        this._damages = [];
        this._homeX = 0;
        this._homeY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._targetOffsetX = NaN;
        this._targetOffsetY = NaN;
        this._movementDuration = 0;
        this._selectionEffectCount = 0;
    };

    public setBattler(battler) {
        this._battler = battler;
    };

    public checkBattler(battler) {
        return this._battler === battler;
    };

    public mainSprite():this|Sprite {
        return this;
    };

    public setHome(x, y) {
        this._homeX = x;
        this._homeY = y;
        this.updatePosition();
    };

    public update() {
        Sprite_Clickable.prototype.update.call(this);
        if (this._battler) {
            this.updateMain();
            this.updateDamagePopup();
            this.updateSelectionEffect();
            this.updateVisibility();
        } else {
            this.bitmap = null;
        }
    };

    public updateVisibility() {
        Sprite_Clickable.prototype.updateVisibility.call(this);
        if (!this._battler || !this._battler.isSpriteVisible()) {
            this.visible = false;
        }
    };

    public updateMain() {
        if (this._battler.isSpriteVisible()) {
            this.updateBitmap();
            this.updateFrame();
        }
        this.updateMove();
        this.updatePosition();
    };

    public updateBitmap() {
        //
    };

    public updateFrame() {
        //
    };

    public updateMove() {
        if (this._movementDuration > 0) {
            const d = this._movementDuration;
            this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
            this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
            this._movementDuration--;
            if (this._movementDuration === 0) {
                this.onMoveEnd();
            }
        }
    };

    public updatePosition() {
        this.x = this._homeX + this._offsetX;
        this.y = this._homeY + this._offsetY;
    };

    public updateDamagePopup() {
        this.setupDamagePopup();
        if (this._damages.length > 0) {
            for (const damage of this._damages) {
                damage.update();
            }
            if (!this._damages[0].isPlaying()) {
                this.destroyDamageSprite(this._damages[0]);
            }
        }
    };

    public updateSelectionEffect() {
        const target = this.mainSprite();
        if (this._battler.isSelected()) {
            this._selectionEffectCount++;
            if (this._selectionEffectCount % 30 < 15) {
                target.setBlendColor([255, 255, 255, 64]);
            } else {
                target.setBlendColor([0, 0, 0, 0]);
            }
        } else if (this._selectionEffectCount > 0) {
            this._selectionEffectCount = 0;
            target.setBlendColor([0, 0, 0, 0]);
        }
    };

    public setupDamagePopup() {
        if (this._battler.isDamagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                this.createDamageSprite();
            }
            this._battler.clearDamagePopup();
            this._battler.clearResult();
        }
    };

    public createDamageSprite() {
        const last = this._damages[this._damages.length - 1];
        const sprite = new Sprite_Damage();
        if (last) {
            sprite.x = last.x + 8;
            sprite.y = last.y - 16;
        } else {
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
        }
        sprite.setup(this._battler);
        this._damages.push(sprite);
        this.parent.addChild(sprite as unknown as PIXI.DisplayObject);
    };

    public destroyDamageSprite(sprite) {
        this.parent.removeChild(sprite);
        this._damages.remove(sprite);
        sprite.destroy();
    };

    public damageOffsetX() {
        return 0;
    };

    public damageOffsetY() {
        return 0;
    };

    public startMove(x, y, duration) {
        if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
            this._targetOffsetX = x;
            this._targetOffsetY = y;
            this._movementDuration = duration;
            if (duration === 0) {
                this._offsetX = x;
                this._offsetY = y;
            }
        }
    };

    public onMoveEnd() {
        //
    };

    public isEffecting() {
        return false;
    };

    public isMoving() {
        return this._movementDuration > 0;
    };

    public inHomePosition() {
        return this._offsetX === 0 && this._offsetY === 0;
    };

    public onMouseEnter() {
        $gameTemp.setTouchState(this._battler, "select");
    };

    public onPress() {
        $gameTemp.setTouchState(this._battler, "select");
    };

    public onClick() {
        $gameTemp.setTouchState(this._battler, "click");
    };
}
