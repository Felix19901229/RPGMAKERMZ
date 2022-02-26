import { Graphics, Rectangle } from "../Core/index.js";
import { DataManager } from "../Manager/index.js";
import { Window_Help, Window_SavefileList } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";
export class Scene_File extends Scene_MenuBase {
    _listWindow;
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
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        this.createListWindow();
        this._helpWindow.setText(this.helpWindowText());
    }
    ;
    helpAreaHeight() {
        return 0;
    }
    ;
    start() {
        Scene_MenuBase.prototype.start.call(this);
        this._listWindow.refresh();
    }
    ;
    savefileId() {
        return this._listWindow.savefileId();
    }
    ;
    isSavefileEnabled(savefileId) {
        return this._listWindow.isEnabled(savefileId);
    }
    ;
    createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    }
    ;
    helpWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, false);
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    createListWindow() {
        const rect = this.listWindowRect();
        this._listWindow = new Window_SavefileList(rect);
        this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
        this._listWindow.setHandler("cancel", this.popScene.bind(this));
        this._listWindow.setMode(this.mode(), this.needsAutosave());
        this._listWindow.selectSavefile(this.firstSavefileId());
        this._listWindow.refresh();
        this.addWindow(this._listWindow);
    }
    ;
    listWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop() + this._helpWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._helpWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    mode() {
        return null;
    }
    ;
    needsAutosave() {
        return window.$gameSystem.isAutosaveEnabled();
    }
    ;
    activateListWindow() {
        this._listWindow.activate();
    }
    ;
    helpWindowText() {
        return "";
    }
    ;
    firstSavefileId() {
        return 0;
    }
    ;
    onSavefileOk() {
    }
    ;
}
