import { Graphics, Rectangle } from "../Core/index.js";
import { SceneManager } from "../Manager/index.js";
import { Window_MenuCommand, Window_Gold, Window_MenuStatus } from "../Window/index.js";
import { Scene_Equip, Scene_GameEnd, Scene_Item, Scene_MenuBase, Scene_Options, Scene_Save, Scene_Skill, Scene_Status } from "./index.js";
export class Scene_Menu extends Scene_MenuBase {
    _statusWindow;
    _commandWindow;
    _goldWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    }
    ;
    helpAreaHeight() {
        return 0;
    }
    ;
    create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
    }
    ;
    start() {
        Scene_MenuBase.prototype.start.call(this);
        this._statusWindow.refresh();
    }
    ;
    createCommandWindow() {
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
    }
    ;
    commandWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.goldWindowRect().height;
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    }
    ;
    goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaBottom() - wh;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_MenuStatus(rect);
        this.addWindow(this._statusWindow);
    }
    ;
    statusWindowRect() {
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight();
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    commandItem() {
        SceneManager.push(Scene_Item);
    }
    ;
    commandPersonal() {
        this._statusWindow.setFormationMode(false);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
        this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
    }
    ;
    commandFormation() {
        this._statusWindow.setFormationMode(true);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
        this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
    }
    ;
    commandOptions() {
        SceneManager.push(Scene_Options);
    }
    ;
    commandSave() {
        SceneManager.push(Scene_Save);
    }
    ;
    commandGameEnd() {
        SceneManager.push(Scene_GameEnd);
    }
    ;
    onPersonalOk() {
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
    }
    ;
    onPersonalCancel() {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }
    ;
    onFormationOk() {
        const index = this._statusWindow.index();
        const pendingIndex = this._statusWindow.pendingIndex();
        if (pendingIndex >= 0) {
            window.$gameParty.swapOrder(index, pendingIndex);
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.redrawItem(index);
        }
        else {
            this._statusWindow.setPendingIndex(index);
        }
        this._statusWindow.activate();
    }
    ;
    onFormationCancel() {
        if (this._statusWindow.pendingIndex() >= 0) {
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.activate();
        }
        else {
            this._statusWindow.deselect();
            this._commandWindow.activate();
        }
    }
    ;
}
