import { Graphics, Rectangle } from "../Core/index.js";
import { Window_DebugRange, Window_DebugEdit, Window_Base } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Scene_Debug
 * 
 * The scene class of the debug screen.
*/
export class Scene_Debug extends Scene_MenuBase {
    _rangeWindow: Window_DebugRange;
    _editWindow: Window_DebugEdit;
    _debugHelpWindow: Window_Base;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    public create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createRangeWindow();
        this.createEditWindow();
        this.createDebugHelpWindow();
    };

    public needsCancelButton() {
        return false;
    };

    public createRangeWindow() {
        const rect = this.rangeWindowRect();
        this._rangeWindow = new Window_DebugRange(rect);
        this._rangeWindow.setHandler("ok", this.onRangeOk.bind(this));
        this._rangeWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._rangeWindow);
    };

    public rangeWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = 246;
        const wh = Graphics.boxHeight;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createEditWindow() {
        const rect = this.editWindowRect();
        this._editWindow = new Window_DebugEdit(rect);
        this._editWindow.setHandler("cancel", this.onEditCancel.bind(this));
        this._rangeWindow.setEditWindow(this._editWindow);
        this.addWindow(this._editWindow);
    };

    public editWindowRect() {
        const wx = this._rangeWindow.width;
        const wy = 0;
        const ww = Graphics.boxWidth - wx;
        const wh = this.calcWindowHeight(10, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    public createDebugHelpWindow() {
        const rect = this.debugHelpWindowRect();
        this._debugHelpWindow = new Window_Base(rect);
        this.addWindow(this._debugHelpWindow);
    };

    public debugHelpWindowRect() {
        const wx = this._editWindow.x;
        const wy = this._editWindow.height;
        const ww = this._editWindow.width;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    public onRangeOk() {
        this._editWindow.activate();
        this._editWindow.select(0);
        this.refreshHelpWindow();
    };

    public onEditCancel() {
        this._rangeWindow.activate();
        this._editWindow.deselect();
        this.refreshHelpWindow();
    };

    public refreshHelpWindow() {
        const helpWindow = this._debugHelpWindow;
        helpWindow.contents.clear();
        if (this._editWindow.active) {
            const rect = helpWindow.baseTextRect();
            helpWindow.drawTextEx(this.helpText(), rect.x, rect.y, rect.width);
        }
    };

    public helpText() {
        if (this._rangeWindow.mode() === "switch") {
            return "Enter : ON / OFF";
        } else {
            return (
                "Left     :  -1    Pageup   : -10\n" +
                "Right    :  +1    Pagedown : +10"
            );
        }
    };
}
