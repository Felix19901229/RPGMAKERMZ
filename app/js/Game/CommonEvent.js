import { Game_Interpreter } from "./index.js";
export class Game_CommonEvent {
    _commonEventId;
    _interpreter;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(commonEventId) {
        this._commonEventId = commonEventId;
        this.refresh();
    }
    event() {
        return window.$dataCommonEvents[this._commonEventId];
    }
    list() {
        return this.event().list;
    }
    refresh() {
        if (this.isActive()) {
            if (!this._interpreter) {
                this._interpreter = new Game_Interpreter();
            }
        }
        else {
            this._interpreter = null;
        }
    }
    isActive() {
        const event = this.event();
        return event.trigger === 2 && window.$gameSwitches.value(event.switchId);
    }
    update() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list());
            }
            this._interpreter.update();
        }
    }
}
