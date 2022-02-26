
import { Game_Actor } from "../Game/index.js";
import { Rectangle } from "../Core/index.js";
import { ColorManager } from "../Manager/index.js";
import { Window_StatusBase ,Window_EquipStatus,Window_EquipItem} from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_EquipSlot
 * 
 * The window for selecting an equipment slot on the equipment screen.
*/
export class Window_EquipSlot extends Window_StatusBase {
    _actor: Game_Actor;
    _itemWindow: Window_EquipItem;
    _statusWindow: Window_EquipStatus;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
        this.refresh();
    };

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    public update() {
        Window_StatusBase.prototype.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.index());
        }
    };

    public maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    };

    public item() {
        return this.itemAt(this.index());
    };

    public itemAt(index) {
        return this._actor ? this._actor.equips()[index] : null;
    };

    public drawItem(index) {
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
    };

    public slotNameWidth() {
        return 138;
    };

    public isEnabled(index) {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    };

    public isCurrentItemEnabled() {
        return this.isEnabled(this.index());
    };

    public setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    };

    public setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
    };

    public updateHelp() {
        Window_StatusBase.prototype.updateHelp.call(this);
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setTempActor(null);
        }
    };


}
