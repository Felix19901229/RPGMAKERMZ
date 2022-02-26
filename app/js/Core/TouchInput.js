import { Graphics } from "./index.js";
export class TouchInput {
    static _date;
    static _currentState;
    static _x;
    static _y;
    static _mousePressed;
    static _screenPressed;
    static _pressedTime;
    static _clicked;
    static _newState;
    static _triggerX;
    static _triggerY;
    static _moved;
    static get wheelX() {
        return this._currentState.wheelX;
    }
    static get wheelY() {
        return this._currentState.wheelY;
    }
    static get x() {
        return this._x;
    }
    static get y() {
        return this._y;
    }
    static get date() {
        return this._date;
    }
    constructor() {
        throw new Error("This is a static class");
    }
    static initialize() {
        this.clear();
        this._setupEventHandlers();
    }
    static keyRepeatWait = 24;
    static keyRepeatInterval = 6;
    static moveThreshold = 10;
    static clear() {
        this._mousePressed = false;
        this._screenPressed = false;
        this._pressedTime = 0;
        this._clicked = false;
        this._newState = this._createNewState();
        this._currentState = this._createNewState();
        this._x = 0;
        this._y = 0;
        this._triggerX = 0;
        this._triggerY = 0;
        this._moved = false;
        this._date = 0;
    }
    static update() {
        this._currentState = this._newState;
        this._newState = this._createNewState();
        this._clicked = this._currentState.released && !this._moved;
        if (this.isPressed()) {
            this._pressedTime++;
        }
    }
    static isClicked() {
        return this._clicked;
    }
    static isPressed() {
        return this._mousePressed || this._screenPressed;
    }
    static isTriggered() {
        return this._currentState.triggered;
    }
    static isRepeated() {
        return (this.isPressed() &&
            (this._currentState.triggered ||
                (this._pressedTime >= this.keyRepeatWait &&
                    this._pressedTime % this.keyRepeatInterval === 0)));
    }
    static isLongPressed() {
        return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
    }
    static isCancelled() {
        return this._currentState.cancelled;
    }
    static isMoved() {
        return this._currentState.moved;
    }
    static isHovered() {
        return this._currentState.hovered;
    }
    static isReleased() {
        return this._currentState.released;
    }
    static _createNewState() {
        return {
            triggered: false,
            cancelled: false,
            moved: false,
            hovered: false,
            released: false,
            wheelX: 0,
            wheelY: 0
        };
    }
    static _setupEventHandlers() {
        const pf = { passive: false };
        document.addEventListener("mousedown", this._onMouseDown.bind(this));
        document.addEventListener("mousemove", this._onMouseMove.bind(this));
        document.addEventListener("mouseup", this._onMouseUp.bind(this));
        document.addEventListener("wheel", this._onWheel.bind(this), pf);
        document.addEventListener("touchstart", this._onTouchStart.bind(this), pf);
        document.addEventListener("touchmove", this._onTouchMove.bind(this), pf);
        document.addEventListener("touchend", this._onTouchEnd.bind(this));
        document.addEventListener("touchcancel", this._onTouchCancel.bind(this));
        window.addEventListener("blur", this._onLostFocus.bind(this));
    }
    static _onMouseDown(event) {
        if (event.button === 0) {
            this._onLeftButtonDown(event);
        }
        else if (event.button === 1) {
            this._onMiddleButtonDown(event);
        }
        else if (event.button === 2) {
            this._onRightButtonDown(event);
        }
    }
    static _onLeftButtonDown(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._mousePressed = true;
            this._pressedTime = 0;
            this._onTrigger(x, y);
        }
    }
    static _onMiddleButtonDown(...args) {
    }
    static _onRightButtonDown(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._onCancel(x, y);
        }
    }
    static _onMouseMove(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (this._mousePressed) {
            this._onMove(x, y);
        }
        else if (Graphics.isInsideCanvas(x, y)) {
            this._onHover(x, y);
        }
    }
    static _onMouseUp(event) {
        if (event.button === 0) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            this._mousePressed = false;
            this._onRelease(x, y);
        }
    }
    static _onWheel(event) {
        this._newState.wheelX += event.deltaX;
        this._newState.wheelY += event.deltaY;
        event.preventDefault();
    }
    static _onTouchStart(event) {
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            if (Graphics.isInsideCanvas(x, y)) {
                this._screenPressed = true;
                this._pressedTime = 0;
                if (event.touches.length >= 2) {
                    this._onCancel(x, y);
                }
                else {
                    this._onTrigger(x, y);
                }
                event.preventDefault();
            }
        }
        if (window.cordova || window.navigator.standalone) {
            event.preventDefault();
        }
    }
    static _onTouchMove(event) {
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this._onMove(x, y);
        }
    }
    static _onTouchEnd(event) {
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this._screenPressed = false;
            this._onRelease(x, y);
        }
    }
    static _onTouchCancel() {
        this._screenPressed = false;
    }
    static _onLostFocus() {
        this.clear();
    }
    static _onTrigger(x, y) {
        this._newState.triggered = true;
        this._x = x;
        this._y = y;
        this._triggerX = x;
        this._triggerY = y;
        this._moved = false;
        this._date = Date.now();
    }
    static _onCancel(x, y) {
        this._newState.cancelled = true;
        this._x = x;
        this._y = y;
    }
    static _onMove(x, y) {
        const dx = Math.abs(x - this._triggerX);
        const dy = Math.abs(y - this._triggerY);
        if (dx > this.moveThreshold || dy > this.moveThreshold) {
            this._moved = true;
        }
        if (this._moved) {
            this._newState.moved = true;
            this._x = x;
            this._y = y;
        }
    }
    static _onHover(x, y) {
        this._newState.hovered = true;
        this._x = x;
        this._y = y;
    }
    static _onRelease(x, y) {
        this._newState.released = true;
        this._x = x;
        this._y = y;
    }
}
