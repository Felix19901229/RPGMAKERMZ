import { Point, Rectangle, Sprite, TouchInput } from "../Core/index.js";
export class Sprite_Clickable extends Sprite {
    _pressed;
    _hovered;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this._pressed = false;
        this._hovered = false;
    }
    ;
    update() {
        Sprite.prototype.update.call(this);
        this.processTouch();
    }
    ;
    processTouch() {
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
            }
            else {
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
        }
        else {
            this._pressed = false;
            this._hovered = false;
        }
    }
    ;
    isPressed() {
        return this._pressed;
    }
    ;
    isClickEnabled() {
        return this.worldVisible;
    }
    ;
    isBeingTouched() {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    }
    ;
    hitTest(x, y) {
        const rect = new Rectangle(-this.anchor.x * this.width, -this.anchor.y * this.height, this.width, this.height);
        return rect.contains(x, y);
    }
    ;
    onMouseEnter() {
    }
    ;
    onMouseExit() {
    }
    ;
    onPress() {
    }
    ;
    onClick() {
    }
    ;
}
