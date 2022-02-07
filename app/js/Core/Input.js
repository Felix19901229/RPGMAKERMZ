export class Input {
    static _dir4;
    static _dir8;
    static _date;
    static _currentState;
    static _previousState;
    static _gamepadStates;
    static _latestButton;
    static _pressedTime;
    static _preferredAxis;
    static _virtualButton;
    static get dir4() {
        return this._dir4;
    }
    static get dir8() {
        return this._dir8;
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
    ;
    static keyRepeatWait = 24;
    static keyRepeatInterval = 6;
    static keyMapper = {
        "Tab": "tab",
        "Enter": "ok",
        "Shift": "shift",
        "Control": "control",
        "Alt": "control",
        "Escape": "escape",
        "Space": "ok",
        "PageUp": "pageup",
        "PageDown": "pagedown",
        "ArrowLeft": "left",
        "ArrowUp": "up",
        "ArrowRight": "right",
        "ArrowDown": "down",
        "Insert": "escape",
        "KeyQ": "pageup",
        "KeyW": "pagedown",
        "KeyX": "escape",
        "KeyZ": "ok",
        "Digit0": "escape",
        "Digit2": "down",
        "Digit4": "left",
        "Digit6": "right",
        "Digit8": "up",
        "F9": "debug"
    };
    static gamepadMapper = {
        0: "ok",
        1: "cancel",
        2: "shift",
        3: "menu",
        4: "pageup",
        5: "pagedown",
        12: "up",
        13: "down",
        14: "left",
        15: "right"
    };
    static clear() {
        this._currentState = {};
        this._previousState = {};
        this._gamepadStates = [];
        this._latestButton = null;
        this._pressedTime = 0;
        this._dir4 = 0;
        this._dir8 = 0;
        this._preferredAxis = "";
        this._date = 0;
        this._virtualButton = null;
    }
    ;
    static update() {
        this._pollGamepads();
        if (this._currentState[this._latestButton]) {
            this._pressedTime++;
        }
        else {
            this._latestButton = null;
        }
        for (const name in this._currentState) {
            if (this._currentState[name] && !this._previousState[name]) {
                this._latestButton = name;
                this._pressedTime = 0;
                this._date = Date.now();
            }
            this._previousState[name] = this._currentState[name];
        }
        if (this._virtualButton) {
            this._latestButton = this._virtualButton;
            this._pressedTime = 0;
            this._virtualButton = null;
        }
        this._updateDirection();
    }
    ;
    static isPressed(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isPressed("escape")) {
            return true;
        }
        else {
            return !!this._currentState[keyName];
        }
    }
    ;
    static isTriggered(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isTriggered("escape")) {
            return true;
        }
        else {
            return this._latestButton === keyName && this._pressedTime === 0;
        }
    }
    ;
    static isRepeated(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isRepeated("escape")) {
            return true;
        }
        else {
            return (this._latestButton === keyName &&
                (this._pressedTime === 0 ||
                    (this._pressedTime >= this.keyRepeatWait &&
                        this._pressedTime % this.keyRepeatInterval === 0)));
        }
    }
    ;
    static isLongPressed(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isLongPressed("escape")) {
            return true;
        }
        else {
            return (this._latestButton === keyName &&
                this._pressedTime >= this.keyRepeatWait);
        }
    }
    ;
    static virtualClick(buttonName) {
        this._virtualButton = buttonName;
    }
    ;
    static _setupEventHandlers() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
        document.addEventListener("keyup", this._onKeyUp.bind(this));
        window.addEventListener("blur", this._onLostFocus.bind(this));
    }
    ;
    static _onKeyDown(event) {
        if (this._shouldPreventDefault(event.code)) {
            event.preventDefault();
        }
        if (event.keyCode === 144) {
            this.clear();
        }
        const buttonName = this.keyMapper[event.code];
        if (buttonName) {
            this._currentState[buttonName] = true;
        }
    }
    ;
    static _shouldPreventDefault(key) {
        switch (key) {
            case "Backspace":
            case "Tab":
            case "PageUp":
            case "PageDown":
            case "ArrowLeft":
            case "ArrowUp":
            case "ArrowRight":
            case "ArrowDown":
                return true;
        }
        return false;
    }
    ;
    static _onKeyUp(event) {
        const buttonName = this.keyMapper[event.code];
        if (buttonName) {
            this._currentState[buttonName] = false;
        }
    }
    ;
    static _onLostFocus() {
        this.clear();
    }
    ;
    static _pollGamepads() {
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            if (gamepads) {
                for (const gamepad of gamepads) {
                    if (gamepad && gamepad.connected) {
                        this._updateGamepadState(gamepad);
                    }
                }
            }
        }
    }
    ;
    static _updateGamepadState(gamepad) {
        const lastState = this._gamepadStates[gamepad.index] || [];
        const newState = [];
        const buttons = gamepad.buttons;
        const axes = gamepad.axes;
        const threshold = 0.5;
        newState[12] = false;
        newState[13] = false;
        newState[14] = false;
        newState[15] = false;
        for (let i = 0; i < buttons.length; i++) {
            newState[i] = buttons[i].pressed;
        }
        if (axes[1] < -threshold) {
            newState[12] = true;
        }
        else if (axes[1] > threshold) {
            newState[13] = true;
        }
        if (axes[0] < -threshold) {
            newState[14] = true;
        }
        else if (axes[0] > threshold) {
            newState[15] = true;
        }
        for (let j = 0; j < newState.length; j++) {
            if (newState[j] !== lastState[j]) {
                const buttonName = this.gamepadMapper[j];
                if (buttonName) {
                    this._currentState[buttonName] = newState[j];
                }
            }
        }
        this._gamepadStates[gamepad.index] = newState;
    }
    ;
    static _updateDirection() {
        let x = this._signX();
        let y = this._signY();
        this._dir8 = this._makeNumpadDirection(x, y);
        if (x !== 0 && y !== 0) {
            if (this._preferredAxis === "x") {
                y = 0;
            }
            else {
                x = 0;
            }
        }
        else if (x !== 0) {
            this._preferredAxis = "y";
        }
        else if (y !== 0) {
            this._preferredAxis = "x";
        }
        this._dir4 = this._makeNumpadDirection(x, y);
    }
    ;
    static _signX() {
        const left = this.isPressed("left") ? 1 : 0;
        const right = this.isPressed("right") ? 1 : 0;
        return right - left;
    }
    ;
    static _signY() {
        const up = this.isPressed("up") ? 1 : 0;
        const down = this.isPressed("down") ? 1 : 0;
        return down - up;
    }
    ;
    static _makeNumpadDirection(x, y) {
        if (x === 0 && y === 0) {
            return 0;
        }
        else {
            return 5 - y * 3 + x;
        }
    }
    ;
    static _isEscapeCompatible(keyName) {
        return keyName === "cancel" || keyName === "menu";
    }
    ;
}
