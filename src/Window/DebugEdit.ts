import { Input, Rectangle } from "../Core/index.js";
import { Window_Selectable } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_DebugEdit
 * 
 * The window for displaying switches and variables on the debug screen.
*/
export class Window_DebugEdit extends Window_Selectable {
    _mode: "switch";
    _topId: number;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._mode = "switch";
        this._topId = 1;
        this.refresh();
    };

    public maxItems() {
        return 10;
    };

    public drawItem(index) {
        const dataId = this._topId + index;
        const idText = dataId.padZero(4) + ":";
        const idWidth = this.textWidth(idText);
        const statusWidth = this.textWidth("-00000000");
        const name = this.itemName(dataId);
        const status = this.itemStatus(dataId);
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.drawText(idText, rect.x, rect.y, rect.width);
        rect.x += idWidth;
        rect.width -= idWidth + statusWidth;
        this.drawText(name, rect.x, rect.y, rect.width);
        this.drawText(status, rect.x + rect.width, rect.y, statusWidth, "right");
    };

    public itemName(dataId) {
        if (this._mode === "switch") {
            return window.$dataSystem.switches[dataId];
        } else {
            return window.$dataSystem.variables[dataId];
        }
    };

    public itemStatus(dataId) {
        if (this._mode === "switch") {
            return window.$gameSwitches.value(dataId) ? "[ON]" : "[OFF]";
        } else {
            return String(window.$gameVariables.value(dataId));
        }
    };

    public setMode(mode) {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    };

    public setTopId(id) {
        if (this._topId !== id) {
            this._topId = id;
            this.refresh();
        }
    };

    public currentId() {
        return this._topId + this.index();
    };

    public update() {
        Window_Selectable.prototype.update.call(this);
        if (this.active) {
            if (this._mode === "switch") {
                this.updateSwitch();
            } else {
                this.updateVariable();
            }
        }
    };

    public updateSwitch() {
        if (Input.isRepeated("ok")) {
            const switchId = this.currentId();
            this.playCursorSound();
            window.$gameSwitches.setValue(switchId, !window.$gameSwitches.value(switchId));
            this.redrawCurrentItem();
        }
    };

    public updateVariable() {
        const variableId = this.currentId();
        const value = window.$gameVariables.value(variableId);
        if (typeof value === "number") {
            const newValue = value + this.deltaForVariable();
            if (value !== newValue) {
                window.$gameVariables.setValue(variableId, newValue);
                this.playCursorSound();
                this.redrawCurrentItem();
            }
        }
    };

    public deltaForVariable() {
        if (Input.isRepeated("right")) {
            return 1;
        } else if (Input.isRepeated("left")) {
            return -1;
        } else if (Input.isRepeated("pagedown")) {
            return 10;
        } else if (Input.isRepeated("pageup")) {
            return -10;
        }
        return 0;
    };

}
