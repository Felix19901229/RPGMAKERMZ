import { Graphics, Rectangle } from "../Core/index.js";
import { ConfigManager } from "../Manager/index.js";
import { Window_Options } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Scene_Options
 * 
 * The scene class of the options screen.
*/
export class Scene_Options extends Scene_MenuBase {
    _optionsWindow: Window_Options;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    public create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createOptionsWindow();
    };

    public terminate() {
        Scene_MenuBase.prototype.terminate.call(this);
        ConfigManager.save();
    };

    public createOptionsWindow() {
        const rect = this.optionsWindowRect();
        this._optionsWindow = new Window_Options(rect);
        this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    };

    public optionsWindowRect() {
        const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
        const ww = 400;
        const wh = this.calcWindowHeight(n, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    public maxCommands() {
        // Increase this value when adding option items.
        return 7;
    };

    public maxVisibleCommands() {
        return 12;
    };
}
