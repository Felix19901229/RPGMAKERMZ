import { Graphics, Rectangle } from "../Core/index.js";
import { ConfigManager } from "../Manager/index.js";
import { Window_Options } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";
export class Scene_Options extends Scene_MenuBase {
    _optionsWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    }
    ;
    create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createOptionsWindow();
    }
    ;
    terminate() {
        Scene_MenuBase.prototype.terminate.call(this);
        ConfigManager.save();
    }
    ;
    createOptionsWindow() {
        const rect = this.optionsWindowRect();
        this._optionsWindow = new Window_Options(rect);
        this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    }
    ;
    optionsWindowRect() {
        const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
        const ww = 400;
        const wh = this.calcWindowHeight(n, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    maxCommands() {
        return 7;
    }
    ;
    maxVisibleCommands() {
        return 12;
    }
    ;
}
