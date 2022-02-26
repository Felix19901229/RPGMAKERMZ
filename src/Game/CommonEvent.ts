import { Game_Interpreter } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Game_CommonEvent
 * 
 * The game object class for a common event. It contains functionality for
 * running parallel process events.
*/
export class Game_CommonEvent {
    _commonEventId: number;
    _interpreter: Game_Interpreter;
    constructor(...args: [number]) {
        this.initialize(...args);
    }

    public initialize(commonEventId) {
        this._commonEventId = commonEventId;
        this.refresh();
    }

    public event() {
        return window.$dataCommonEvents[this._commonEventId];
    }

    public list() {
        return this.event().list;
    }

    public refresh() {
        if (this.isActive()) {
            if (!this._interpreter) {
                this._interpreter = new Game_Interpreter();
            }
        } else {
            this._interpreter = null;
        }
    }

    public isActive() {
        const event = this.event();
        return event.trigger === 2 && window.$gameSwitches.value(event.switchId);
    }

    public update() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list());
            }
            this._interpreter.update();
        }
    }
}
