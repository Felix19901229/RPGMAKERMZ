import { Input, TouchInput, Point, Rectangle } from "../Core/index.js";
import { Window_Base } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_Scrollable
 * 
 * The window class with scroll functions.
*/
export class Window_Scrollable extends Window_Base {
    _scrollX: number;
    _scrollY: number;
    _scrollBaseX: number;
    _scrollBaseY: number;
    _scrollTargetX: number;
    _scrollTargetY: number;
    _scrollDuration: number;
    _scrollAccelX: number;
    _scrollAccelY: number;
    _scrollTouching: boolean;
    _scrollLastTouchX: number;
    _scrollLastTouchY: number;
    _scrollLastCursorVisible: boolean;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);

    }

    public initialize(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._scrollX = 0;
        this._scrollY = 0;
        this._scrollBaseX = 0;
        this._scrollBaseY = 0;
        this.clearScrollStatus();
    };

    public clearScrollStatus() {
        this._scrollTargetX = 0;
        this._scrollTargetY = 0;
        this._scrollDuration = 0;
        this._scrollAccelX = 0;
        this._scrollAccelY = 0;
        this._scrollTouching = false;
        this._scrollLastTouchX = 0;
        this._scrollLastTouchY = 0;
        this._scrollLastCursorVisible = false;
    };

    public scrollX() {
        return this._scrollX;
    };

    public scrollY() {
        return this._scrollY;
    };

    public scrollBaseX() {
        return this._scrollBaseX;
    };

    public scrollBaseY() {
        return this._scrollBaseY;
    };

    public scrollTo(x, y) {
        const scrollX = x.clamp(0, this.maxScrollX());
        const scrollY = y.clamp(0, this.maxScrollY());
        if (this._scrollX !== scrollX || this._scrollY !== scrollY) {
            this._scrollX = scrollX;
            this._scrollY = scrollY;
            this.updateOrigin();
        }
    };

    public scrollBy(x, y) {
        this.scrollTo(this._scrollX + x, this._scrollY + y);
    };

    public smoothScrollTo(x, y) {
        this._scrollTargetX = x.clamp(0, this.maxScrollX());
        this._scrollTargetY = y.clamp(0, this.maxScrollY());
        this._scrollDuration = Input.keyRepeatInterval;
    };

    public smoothScrollBy(x, y) {
        if (this._scrollDuration === 0) {
            this._scrollTargetX = this.scrollX();
            this._scrollTargetY = this.scrollY();
        }
        this.smoothScrollTo(this._scrollTargetX + x, this._scrollTargetY + y);
    };

    public setScrollAccel(x, y) {
        this._scrollAccelX = x;
        this._scrollAccelY = y;
    };

    public overallWidth() {
        return this.innerWidth;
    };

    public overallHeight() {
        return this.innerHeight;
    };

    public maxScrollX() {
        return Math.max(0, this.overallWidth() - this.innerWidth);
    };

    public maxScrollY() {
        return Math.max(0, this.overallHeight() - this.innerHeight);
    };

    public scrollBlockWidth() {
        return this.itemWidth();
    };

    public scrollBlockHeight() {
        return this.itemHeight();
    };

    public smoothScrollDown(n) {
        this.smoothScrollBy(0, this.itemHeight() * n);
    };

    public smoothScrollUp(n) {
        this.smoothScrollBy(0, -this.itemHeight() * n);
    };

    public update() {
        Window_Base.prototype.update.call(this);
        this.processWheelScroll();
        this.processTouchScroll();
        this.updateSmoothScroll();
        this.updateScrollAccel();
        this.updateArrows();
        this.updateOrigin();
    };

    public processWheelScroll() {
        if (this.isWheelScrollEnabled() && this.isTouchedInsideFrame()) {
            const threshold = 20;
            if (TouchInput.wheelY >= threshold) {
                this.smoothScrollDown(1);
            }
            if (TouchInput.wheelY <= -threshold) {
                this.smoothScrollUp(1);
            }
        }
    };

    public processTouchScroll() {
        if (this.isTouchScrollEnabled()) {
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                this.onTouchScrollStart();
            }
            if (this._scrollTouching) {
                if (TouchInput.isReleased()) {
                    this.onTouchScrollEnd();
                } else if (TouchInput.isMoved()) {
                    this.onTouchScroll();
                }
            }
        }
    };

    public isWheelScrollEnabled() {
        return this.isScrollEnabled();
    };

    public isTouchScrollEnabled() {
        return this.isScrollEnabled();
    };

    public isScrollEnabled() {
        return true;
    };

    public isTouchedInsideFrame() {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        return this.innerRect.contains(localPos.x, localPos.y);
    };

    public onTouchScrollStart() {
        this._scrollTouching = true;
        this._scrollLastTouchX = TouchInput.x;
        this._scrollLastTouchY = TouchInput.y;
        this._scrollLastCursorVisible = this.cursorVisible;
        this.setScrollAccel(0, 0);
    };

    public onTouchScroll() {
        const accelX = this._scrollLastTouchX - TouchInput.x;
        const accelY = this._scrollLastTouchY - TouchInput.y;
        this.setScrollAccel(accelX, accelY);
        this._scrollLastTouchX = TouchInput.x;
        this._scrollLastTouchY = TouchInput.y;
        this.cursorVisible = false;
    };

    public onTouchScrollEnd() {
        this._scrollTouching = false;
        this.cursorVisible = this._scrollLastCursorVisible;
    };

    public updateSmoothScroll() {
        if (this._scrollDuration > 0) {
            const d = this._scrollDuration;
            const deltaX = (this._scrollTargetX - this._scrollX) / d;
            const deltaY = (this._scrollTargetY - this._scrollY) / d;
            this.scrollBy(deltaX, deltaY);
            this._scrollDuration--;
        }
    };

    public updateScrollAccel() {
        if (this._scrollAccelX !== 0 || this._scrollAccelY !== 0) {
            this.scrollBy(this._scrollAccelX, this._scrollAccelY);
            this._scrollAccelX *= 0.92;
            this._scrollAccelY *= 0.92;
            if (Math.abs(this._scrollAccelX) < 1) {
                this._scrollAccelX = 0;
            }
            if (Math.abs(this._scrollAccelY) < 1) {
                this._scrollAccelY = 0;
            }
        }
    };

    public updateArrows() {
        this.downArrowVisible = this._scrollY < this.maxScrollY();
        this.upArrowVisible = this._scrollY > 0;
    };

    public updateOrigin() {
        const blockWidth = this.scrollBlockWidth() || 1;
        const blockHeight = this.scrollBlockHeight() || 1;
        const baseX = this._scrollX - (this._scrollX % blockWidth);
        const baseY = this._scrollY - (this._scrollY % blockHeight);
        if (baseX !== this._scrollBaseX || baseY !== this._scrollBaseY) {
            this.updateScrollBase(baseX, baseY);
            this.paint();
        }
        this.origin.x = this._scrollX % blockWidth;
        this.origin.y = this._scrollY % blockHeight;
    };

    public updateScrollBase(baseX, baseY) {
        const deltaX = baseX - this._scrollBaseX;
        const deltaY = baseY - this._scrollBaseY;
        this._scrollBaseX = baseX;
        this._scrollBaseY = baseY;
        this.moveCursorBy(-deltaX, -deltaY);
        this.moveInnerChildrenBy(-deltaX, -deltaY);
    };

    public paint() {
        // to be overridden
    };
}