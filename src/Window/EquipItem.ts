import { Game_Actor } from "../Game/index.js";
import { JsonEx, Rectangle } from "../Core/index.js";
import { Window_ItemList,Window_EquipStatus } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_EquipItem
 * 
 * The window for selecting an equipment item on the equipment screen.
*/
export class Window_EquipItem extends Window_ItemList {
    _actor: Game_Actor;
    _slotId: number;
    _statusWindow: Window_EquipStatus;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_ItemList.prototype.initialize.call(this, rect);
        this._actor = null;
        this._slotId = 0;
    };

    public maxCols() {
        return 1;
    };

    public colSpacing() {
        return 8;
    };

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.scrollTo(0, 0);
        }
    };

    public setSlotId(slotId) {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.scrollTo(0, 0);
        }
    };

    public includes(item) {
        if (item === null) {
            return true;
        }
        return (
            this._actor &&
            this._actor.canEquip(item) &&
            item.etypeId === this.etypeId()
        );
    };

    public etypeId() {
        if (this._actor && this._slotId >= 0) {
            return this._actor.equipSlots()[this._slotId];
        } else {
            return 0;
        }
    };

    public isEnabled(/*item*/) {
        return true;
    };

    public selectLast() {
        //
    };

    public setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    };

    public updateHelp() {
        Window_ItemList.prototype.updateHelp.call(this);
        if (this._actor && this._statusWindow && this._slotId >= 0) {
            const actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item());
            this._statusWindow.setTempActor(actor);
        }
    };

    public playOkSound() {
        //
    };


}
