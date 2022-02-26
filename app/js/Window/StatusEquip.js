import { ColorManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
export class Window_StatusEquip extends Window_StatusBase {
    _actor;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
    }
    ;
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }
    ;
    maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    }
    ;
    itemHeight() {
        return this.lineHeight();
    }
    ;
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const equips = this._actor.equips();
        const item = equips[index];
        const slotName = this.actorSlotName(this._actor, index);
        const sw = 138;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(slotName, rect.x, rect.y, sw, rect.height);
        this.drawItemName(item, rect.x + sw, rect.y, rect.width - sw);
    }
    ;
    drawItemBackground() {
    }
    ;
}
