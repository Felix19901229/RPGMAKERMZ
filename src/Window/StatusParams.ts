import { Rectangle } from "../Core/index.js";
import { Game_Actor } from "../Game/index.js";
import { TextManager, ColorManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_StatusParams
 * 
 * The window for displaying parameters on the status screen.
*/
export class Window_StatusParams extends Window_StatusBase {
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
        return 6;
    };

    public itemHeight() {
        return this.lineHeight();
    };

    public drawItem(index) {
        const rect = this.itemLineRect(index);
        const paramId = index + 2;
        const name = TextManager.param(paramId);
        const value = this._actor.param(paramId);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, rect.x, rect.y, 160);
        this.resetTextColor();
        this.drawText(value, rect.x + 160, rect.y, 60, "right");
    };

    public drawItemBackground(/*index*/) {
        //
    };

}
