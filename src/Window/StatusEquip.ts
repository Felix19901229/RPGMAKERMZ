import { Rectangle } from "../Core/index.js";
import { Game_Actor } from "../Game/index.js";
import { ColorManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_StatusEquip
 * 
 * The window for displaying equipment items on the status screen.
*/
export class Window_StatusEquip extends Window_StatusBase {
    _actor: Game_Actor;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect:Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
    };

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    public maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    };

    public itemHeight() {
        return this.lineHeight();
    };

    public drawItem(index) {
        const rect = this.itemLineRect(index);
        const equips = this._actor.equips();
        const item = equips[index];
        const slotName = this.actorSlotName(this._actor, index);
        const sw = 138;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(slotName, rect.x, rect.y, sw, rect.height);
        this.drawItemName(item, rect.x + sw, rect.y, rect.width - sw);
    };

    public drawItemBackground(/*index*/) {
        //
    };

}
