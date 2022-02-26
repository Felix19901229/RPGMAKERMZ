import { Graphics, Rectangle } from "../Core/index.js";
import { SceneManager } from "../Manager/index.js";
import { Window_GameEnd, Window_TitleCommand } from "../Window/index.js";
import { Scene_MenuBase, Scene_Title } from "./index.js";
export class Scene_GameEnd extends Scene_MenuBase {
    _commandWindow;
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
        this.createCommandWindow();
    }
    ;
    stop() {
        Scene_MenuBase.prototype.stop.call(this);
        this._commandWindow.close();
    }
    ;
    createBackground() {
        Scene_MenuBase.prototype.createBackground.call(this);
        this.setBackgroundOpacity(128);
    }
    ;
    createCommandWindow() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_GameEnd(rect);
        this._commandWindow.setHandler("toTitle", this.commandToTitle.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }
    ;
    commandWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    commandToTitle() {
        this.fadeOutAll();
        SceneManager.goto(Scene_Title);
        Window_TitleCommand.initCommandPosition();
    }
    ;
}
