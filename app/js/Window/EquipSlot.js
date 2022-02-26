import { ColorManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
export class Window_EquipSlot extends Window_StatusBase {
    _actor;
    _itemWindow;
    _statusWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
        this.refresh();
    }
    ;
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }
    ;
    update() {
        Window_StatusBase.prototype.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.index());
        }
    }
    ;
    maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    }
    ;
    item() {
        return this.itemAt(this.index());
    }
    ;
    itemAt(index) {
        return this._actor ? this._actor.equips()[index] : null;
    }
    ;
    drawItem(index) {
        if (this._actor) {
            const slotName = this.actorSlotName(this._actor, index);
            const item = this.itemAt(index);
            const slotNameWidth = this.slotNameWidth();
            const rect = this.itemLineRect(index);
            const itemWidth = rect.width - slotNameWidth;
            this.changeTextColor(ColorManager.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            this.drawText(slotName, rect.x, rect.y, slotNameWidth, rect.height);
            this.drawItemName(item, rect.x + slotNameWidth, rect.y, itemWidth);
            this.changePaintOpacity(true);
        }
    }
    ;
    slotNameWidth() {
        return 138;
    }
    ;
    isEnabled(index) {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    }
    ;
    isCurrentItemEnabled() {
        return this.isEnabled(this.index());
    }
    ;
    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }
    ;
    setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
    }
    ;
    updateHelp() {
        Window_StatusBase.prototype.updateHelp.call(this);
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setTempActor(null);
        }
    }
    ;
}
