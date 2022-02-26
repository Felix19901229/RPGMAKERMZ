import { TextManager, ColorManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
export class Window_StatusParams extends Window_StatusBase {
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
        return 6;
    }
    ;
    itemHeight() {
        return this.lineHeight();
    }
    ;
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const paramId = index + 2;
        const name = TextManager.param(paramId);
        const value = this._actor.param(paramId);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, rect.x, rect.y, 160);
        this.resetTextColor();
        this.drawText(value, rect.x + 160, rect.y, 60, "right");
    }
    ;
    drawItemBackground() {
    }
    ;
}
