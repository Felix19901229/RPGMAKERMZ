import { Graphics, Rectangle } from "../Core/index.js";
import { SceneManager } from "../Manager/index.js";
import { Window_MenuCommand, Window_Gold, Window_MenuStatus } from "../Window/index.js";
import { Scene_Equip, Scene_GameEnd, Scene_Item, Scene_MenuBase, Scene_Options, Scene_Save, Scene_Skill, Scene_Status } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Menu
 * 
 * The scene class of the menu screen.
*/
export class Scene_Menu extends Scene_MenuBase {
    _statusWindow: Nullable<Window_MenuStatus>;
    _commandWindow: Nullable<Window_MenuCommand>;
    _goldWindow: Nullable<Window_Gold>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);

    }

    public initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    public helpAreaHeight() {
        return 0;
    };

    public create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
    };

    public start() {
        Scene_MenuBase.prototype.start.call(this);
        this._statusWindow.refresh();
    };

    public createCommandWindow() {
        const rect = this.commandWindowRect();
        const commandWindow = new Window_MenuCommand(rect);
        commandWindow.setHandler("item", this.commandItem.bind(this));
        commandWindow.setHandler("skill", this.commandPersonal.bind(this));
        commandWindow.setHandler("equip", this.commandPersonal.bind(this));
        commandWindow.setHandler("status", this.commandPersonal.bind(this));
        commandWindow.setHandler("formation", this.commandFormation.bind(this));
        commandWindow.setHandler("options", this.commandOptions.bind(this));
        commandWindow.setHandler("save", this.commandSave.bind(this));
        commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
        commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(commandWindow);
        this._commandWindow = commandWindow;
    };

    public commandWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.goldWindowRect().height;
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    public createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    };

    public goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaBottom() - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_MenuStatus(rect);
        this.addWindow(this._statusWindow);
    };

    public statusWindowRect() {
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight();
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    public commandItem() {
        SceneManager.push(Scene_Item);
    };

    public commandPersonal() {
        this._statusWindow.setFormationMode(false);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
        this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
    };

    public commandFormation() {
        this._statusWindow.setFormationMode(true);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
        this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
    };

    public commandOptions() {
        SceneManager.push(Scene_Options);
    };

    public commandSave() {
        SceneManager.push(Scene_Save);
    };

    public commandGameEnd() {
        SceneManager.push(Scene_GameEnd);
    };

    public onPersonalOk() {
        switch (this._commandWindow.currentSymbol()) {
            case "skill":
                SceneManager.push(Scene_Skill);
                break;
            case "equip":
                SceneManager.push(Scene_Equip);
                break;
            case "status":
                SceneManager.push(Scene_Status);
                break;
        }
    };

    public onPersonalCancel() {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    };

    public onFormationOk() {
        const index = this._statusWindow.index();
        const pendingIndex = this._statusWindow.pendingIndex();
        if (pendingIndex >= 0) {
            window.$gameParty.swapOrder(index, pendingIndex);
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.redrawItem(index);
        } else {
            this._statusWindow.setPendingIndex(index);
        }
        this._statusWindow.activate();
    };

    public onFormationCancel() {
        if (this._statusWindow.pendingIndex() >= 0) {
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.activate();
        } else {
            this._statusWindow.deselect();
            this._commandWindow.activate();
        }
    };
}
