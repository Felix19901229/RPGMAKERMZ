import { Graphics, Rectangle } from "../Core/index.js";
import { DataManager } from "../Manager/index.js";
import { Window_Help, Window_SavefileList } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_File
 * 
 * The superclass of Scene_Save and Scene_Load.
*/
export class Scene_File extends Scene_MenuBase {
    _listWindow: Window_SavefileList;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    public create() {
        Scene_MenuBase.prototype.create.call(this);
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        this.createListWindow();
        this._helpWindow.setText(this.helpWindowText());
    };

    public helpAreaHeight() {
        return 0;
    };

    public start() {
        Scene_MenuBase.prototype.start.call(this);
        this._listWindow.refresh();
    };

    public savefileId() {
        return this._listWindow.savefileId();
    };

    public isSavefileEnabled(savefileId) {
        return this._listWindow.isEnabled(savefileId);
    };

    public createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    };

    public helpWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    public createListWindow() {
        const rect = this.listWindowRect();
        this._listWindow = new Window_SavefileList(rect);
        this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
        this._listWindow.setHandler("cancel", this.popScene.bind(this));
        this._listWindow.setMode(this.mode(), this.needsAutosave());
        this._listWindow.selectSavefile(this.firstSavefileId());
        this._listWindow.refresh();
        this.addWindow(this._listWindow);
    };

    public listWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop() + this._helpWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._helpWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    public mode() {
        return null;
    };

    public needsAutosave() {
        return window.$gameSystem.isAutosaveEnabled();
    };

    public activateListWindow() {
        this._listWindow.activate();
    };

    public helpWindowText() {
        return "";
    };

    public firstSavefileId() {
        return 0;
    };

    public onSavefileOk() {
        //
    };
}
