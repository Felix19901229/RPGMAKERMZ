import { Rectangle, Graphics } from "../Core/index.js";
import { SoundManager } from "../Manager/index.js";
import { Window_EquipStatus, Window_EquipSlot, Window_EquipItem, Window_EquipCommand } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Scene_Equip
 * 
 * The scene class of the equipment screen.
*/
export class Scene_Equip extends Scene_MenuBase {
    _statusWindow: Nullable<Window_EquipStatus>;
    _commandWindow: Nullable<Window_EquipCommand>;
    _slotWindow: Nullable<Window_EquipSlot>;
    _itemWindow: Nullable<Window_EquipItem>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);

    }

    public initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    public create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createStatusWindow();
        this.createCommandWindow();
        this.createSlotWindow();
        this.createItemWindow();
        this.refreshActor();
    };

    public createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_EquipStatus(rect);
        this.addWindow(this._statusWindow);
    };

    public statusWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this.statusWidth();
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    public createCommandWindow() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_EquipCommand(rect);
        this._commandWindow.setHelpWindow(this._helpWindow);
        this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
        this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
        this._commandWindow.setHandler("clear", this.commandClear.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._commandWindow);
    };

    public commandWindowRect() {
        const wx = this.statusWidth();
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    public createSlotWindow() {
        const rect = this.slotWindowRect();
        this._slotWindow = new Window_EquipSlot(rect);
        this._slotWindow.setHelpWindow(this._helpWindow);
        this._slotWindow.setStatusWindow(this._statusWindow);
        this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
        this._slotWindow.setHandler("cancel", this.onSlotCancel.bind(this));
        this.addWindow(this._slotWindow);
    };

    public slotWindowRect() {
        const commandWindowRect = this.commandWindowRect();
        const wx = this.statusWidth();
        const wy = commandWindowRect.y + commandWindowRect.height;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this.mainAreaHeight() - commandWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createItemWindow() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_EquipItem(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setStatusWindow(this._statusWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this._itemWindow.hide();
        this._slotWindow.setItemWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    };

    public itemWindowRect() {
        return this.slotWindowRect();
    };

    public statusWidth() {
        return 312;
    };

    public needsPageButtons() {
        return true;
    };

    public arePageButtonsEnabled() {
        return !(this._itemWindow && this._itemWindow.active);
    };

    public refreshActor() {
        const actor = this.actor();
        this._statusWindow.setActor(actor);
        this._slotWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    };

    public commandEquip() {
        this._slotWindow.activate();
        this._slotWindow.select(0);
    };

    public commandOptimize() {
        SoundManager.playEquip();
        this.actor().optimizeEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
    };

    public commandClear() {
        SoundManager.playEquip();
        this.actor().clearEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
    };

    public onSlotOk() {
        this._slotWindow.hide();
        this._itemWindow.show();
        this._itemWindow.activate();
        this._itemWindow.select(0);
    };

    public onSlotCancel() {
        this._slotWindow.deselect();
        this._commandWindow.activate();
    };

    public onItemOk() {
        SoundManager.playEquip();
        this.executeEquipChange();
        this.hideItemWindow();
        this._slotWindow.refresh();
        this._itemWindow.refresh();
        this._statusWindow.refresh();
    };

    public executeEquipChange() {
        const actor = this.actor();
        const slotId = this._slotWindow.index();
        const item = this._itemWindow.item();
        actor.changeEquip(slotId, item);
    };

    public onItemCancel() {
        this.hideItemWindow();
    };

    public onActorChange() {
        Scene_MenuBase.prototype.onActorChange.call(this);
        this.refreshActor();
        this.hideItemWindow();
        this._slotWindow.deselect();
        this._slotWindow.deactivate();
        this._commandWindow.activate();
    };

    public hideItemWindow() {
        this._slotWindow.show();
        this._slotWindow.activate();
        this._itemWindow.hide();
        this._itemWindow.deselect();
    };
}
