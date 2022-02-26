import { Point, Rectangle, Sprite, TouchInput } from "../Core/index.js";
//-----------------------------------------------------------------------------
/**
 * Sprite_Clickable
 * 
 * The sprite class with click handling functions.
*/
export class Sprite_Clickable extends Sprite {
    _pressed: boolean;
    _hovered: boolean;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }
    public initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this._pressed = false;
        this._hovered = false;
    };
    public update() {
        Sprite.prototype.update.call(this);
        this.processTouch();
    };
    public processTouch() {
        if (this.isClickEnabled()) {
            if (this.isBeingTouched()) {
                if (!this._hovered && TouchInput.isHovered()) {
                    this._hovered = true;
                    this.onMouseEnter();
                }
                if (TouchInput.isTriggered()) {
                    this._pressed = true;
                    this.onPress();
                }
            } else {
                if (this._hovered) {
                    this.onMouseExit();
                }
                this._pressed = false;
                this._hovered = false;
            }
            if (this._pressed && TouchInput.isReleased()) {
                this._pressed = false;
                this.onClick();
            }
        } else {
            this._pressed = false;
            this._hovered = false;
        }
    };
    public isPressed() {
        return this._pressed;
    };
    public isClickEnabled() {
        return this.worldVisible;
    };
    public isBeingTouched() {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    };
    public hitTest(x, y) {
        const rect = new Rectangle(
            -this.anchor.x * this.width,
            -this.anchor.y * this.height,
            this.width,
            this.height
        );
        return rect.contains(x, y);
    };
    public onMouseEnter() {
        //
    };
    public onMouseExit() {
        //
    };
    public onPress() {
        //
    };
    public onClick() {
        //
    };
}

