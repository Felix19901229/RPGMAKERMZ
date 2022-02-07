//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @namespace
 */
export class Input {
    static _dir4: number;
    static _dir8: number;
    static _date: number;
    static _currentState: AnyObject;
    static _previousState: AnyObject;
    static _gamepadStates: AnyObject[];
    static _latestButton: Nullable<string>;
    static _pressedTime: number;
    static _preferredAxis: string;
    static _virtualButton: string;

    /**
     * The four direction value as a number of the numpad, or 0 for neutral.
     *
     * @readonly
     * @type number
     * @name Input.dir4
     */
    static get dir4() {
        return this._dir4;
    }

    /**
    * The eight direction value as a number of the numpad, or 0 for neutral.
    *
    * @readonly
    * @type number
    * @name Input.dir8
    */
    static get dir8() {
        return this._dir8;
    }

    /**
    * The time of the last input in milliseconds.
    *
    * @readonly
    * @type number
    * @name Input.date
    */
    static get date() {
        return this._date;
    }

    constructor() {
        throw new Error("This is a static class");
    }
    /**
     * Initializes the input system.
     */
    static initialize() {
        this.clear();
        this._setupEventHandlers();
    };

    /**
     * The wait time of the key repeat in frames.
     *
     * @type number
     */
    static keyRepeatWait = 24;

    /**
     * The interval of the key repeat in frames.
     *
     * @type number
     */
    static keyRepeatInterval = 6;

    /**
     * A hash table to convert from a virtual key code to a mapped key name.
     *
     * @type Object
     */
    static keyMapper = {
        "Tab": "tab", // tab
        "Enter": "ok", // enter
        "Shift": "shift", // shift
        "Control": "control", // control
        "Alt": "control", // alt
        "Escape": "escape", // escape
        "Space": "ok", // space
        "PageUp": "pageup", // pageup
        "PageDown": "pagedown", // pagedown
        "ArrowLeft": "left", // left arrow
        "ArrowUp": "up", // up arrow
        "ArrowRight": "right", // right arrow
        "ArrowDown": "down", // down arrow
        "Insert": "escape", // insert
        "KeyQ": "pageup", // Q
        "KeyW": "pagedown", // W
        "KeyX": "escape", // X
        "KeyZ": "ok", // Z
        "Digit0": "escape", // numpad 0
        "Digit2": "down", // numpad 2
        "Digit4": "left", // numpad 4
        "Digit6": "right", // numpad 6
        "Digit8": "up", // numpad 8
        "F9": "debug" // F9
    };

    /**
     * A hash table to convert from a gamepad button to a mapped key name.
     *
     * @type Object
     */
    static gamepadMapper = {
        0: "ok", // A
        1: "cancel", // B
        2: "shift", // X
        3: "menu", // Y
        4: "pageup", // LB
        5: "pagedown", // RB
        12: "up", // D-pad up
        13: "down", // D-pad down
        14: "left", // D-pad left
        15: "right" // D-pad right
    };

    /**
     * Clears all the input data.
     */
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
    };

    /**
     * Updates the input data.
     */
    static update() {
        this._pollGamepads();
        if (this._currentState[this._latestButton]) {
            this._pressedTime++;
        } else {
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
    };

    /**
     * Checks whether a key is currently pressed down.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is pressed.
     */
    static isPressed(keyName: string) {
        if (this._isEscapeCompatible(keyName) && this.isPressed("escape")) {
            return true;
        } else {
            return !!this._currentState[keyName];
        }
    };

    /**
     * Checks whether a key is just pressed.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is triggered.
     */
    static isTriggered(keyName: string) {
        if (this._isEscapeCompatible(keyName) && this.isTriggered("escape")) {
            return true;
        } else {
            return this._latestButton === keyName && this._pressedTime === 0;
        }
    };

    /**
     * Checks whether a key is just pressed or a key repeat occurred.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is repeated.
     */
    static isRepeated(keyName: string) {
        if (this._isEscapeCompatible(keyName) && this.isRepeated("escape")) {
            return true;
        } else {
            return (
                this._latestButton === keyName &&
                (this._pressedTime === 0 ||
                    (this._pressedTime >= this.keyRepeatWait &&
                        this._pressedTime % this.keyRepeatInterval === 0))
            );
        }
    };

    /**
     * Checks whether a key is kept depressed.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is long-pressed.
     */
    static isLongPressed(keyName: string) {
        if (this._isEscapeCompatible(keyName) && this.isLongPressed("escape")) {
            return true;
        } else {
            return (
                this._latestButton === keyName &&
                this._pressedTime >= this.keyRepeatWait
            );
        }
    };

    static virtualClick(buttonName: string) {
        this._virtualButton = buttonName;
    };

    static _setupEventHandlers() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
        document.addEventListener("keyup", this._onKeyUp.bind(this));
        window.addEventListener("blur", this._onLostFocus.bind(this));
    };

    static _onKeyDown(event: KeyboardEvent) {
        // keyCode不是标准输入
        // if (this._shouldPreventDefault(event.keyCode)) {
        //     event.preventDefault();
        // }
        if (this._shouldPreventDefault(event.code)) {
            event.preventDefault();
        }
        if (event.keyCode === 144) {
            // Numlock
            this.clear();
        }
        // keyCode不是标准输入
        // const buttonName = this.keyMapper[event.keyCode];
        const buttonName = this.keyMapper[event.code];
        if (buttonName) {
            this._currentState[buttonName] = true;
        }
    };
    // keyCode不是标准输入
    // static _shouldPreventDefault(keyCode) {
    //     switch (keyCode) {
    //         case 8: // backspace
    //         case 9: // tab
    //         case 33: // pageup
    //         case 34: // pagedown
    //         case 37: // left arrow
    //         case 38: // up arrow
    //         case 39: // right arrow
    //         case 40: // down arrow
    //             return true;
    //     }
    //     return false;
    // };
    static _shouldPreventDefault(key:string) {
        switch (key) {
            case "Backspace": // backspace
            case "Tab": // tab
            case "PageUp": // pageup
            case "PageDown": // pagedown
            case "ArrowLeft": // left arrow
            case "ArrowUp": // up arrow
            case "ArrowRight": // right arrow
            case "ArrowDown": // down arrow
                return true;
        }
        return false;
    };
    static _onKeyUp(event:KeyboardEvent) {
        // const buttonName = this.keyMapper[event.keyCode];
        const buttonName = this.keyMapper[event.code];

        if (buttonName) {
            this._currentState[buttonName] = false;
        }
    };

    static _onLostFocus() {
        this.clear();
    };

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
    };

    static _updateGamepadState(gamepad:Gamepad) {
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
            newState[12] = true; // up
        } else if (axes[1] > threshold) {
            newState[13] = true; // down
        }
        if (axes[0] < -threshold) {
            newState[14] = true; // left
        } else if (axes[0] > threshold) {
            newState[15] = true; // right
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
    };

    static _updateDirection() {
        let x = this._signX();
        let y = this._signY();
        this._dir8 = this._makeNumpadDirection(x, y);
        if (x !== 0 && y !== 0) {
            if (this._preferredAxis === "x") {
                y = 0;
            } else {
                x = 0;
            }
        } else if (x !== 0) {
            this._preferredAxis = "y";
        } else if (y !== 0) {
            this._preferredAxis = "x";
        }
        this._dir4 = this._makeNumpadDirection(x, y);
    };

    static _signX() {
        const left = this.isPressed("left") ? 1 : 0;
        const right = this.isPressed("right") ? 1 : 0;
        return right - left;
    };

    static _signY() {
        const up = this.isPressed("up") ? 1 : 0;
        const down = this.isPressed("down") ? 1 : 0;
        return down - up;
    };

    static _makeNumpadDirection(x, y) {
        if (x === 0 && y === 0) {
            return 0;
        } else {
            return 5 - y * 3 + x;
        }
    };

    static _isEscapeCompatible(keyName:string) {
        return keyName === "cancel" || keyName === "menu";
    };

}

