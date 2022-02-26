import { Input } from "../Core/index.js";
import { Window_Selectable } from "./index.js";
export class Window_DebugRange extends Window_Selectable {
    static lastTopRow = 0;
    static lastIndex = 0;
    _maxSwitches;
    _maxVariables;
    _editWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        this._maxSwitches = Math.ceil((window.$dataSystem.switches.length - 1) / 10);
        this._maxVariables = Math.ceil((window.$dataSystem.variables.length - 1) / 10);
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.setTopRow(Window_DebugRange.lastTopRow);
        this.select(Window_DebugRange.lastIndex);
        this.activate();
    }
    ;
    maxItems() {
        return this._maxSwitches + this._maxVariables;
    }
    ;
    update() {
        Window_Selectable.prototype.update.call(this);
        if (this._editWindow) {
            const index = this.index();
            this._editWindow.setMode(this.mode(index));
            this._editWindow.setTopId(this.topId(index));
        }
    }
    ;
    mode(index) {
        return this.isSwitchMode(index) ? "switch" : "variable";
    }
    ;
    topId(index) {
        if (this.isSwitchMode(index)) {
            return index * 10 + 1;
        }
        else {
            return (index - this._maxSwitches) * 10 + 1;
        }
    }
    ;
    isSwitchMode(index) {
        return index < this._maxSwitches;
    }
    ;
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const c = this.isSwitchMode(index) ? "S" : "V";
        const start = this.topId(index);
        const end = start + 9;
        const text = c + " [" + start.padZero(4) + "-" + end.padZero(4) + "]";
        this.drawText(text, rect.x, rect.y, rect.width);
    }
    ;
    isCancelTriggered() {
        return (Window_Selectable.prototype.isCancelTriggered() ||
            Input.isTriggered("debug"));
    }
    ;
    processCancel() {
        Window_Selectable.prototype.processCancel.call(this);
        Window_DebugRange.lastTopRow = this.topRow();
        Window_DebugRange.lastIndex = this.index();
    }
    ;
    setEditWindow(editWindow) {
        this._editWindow = editWindow;
    }
    ;
}
