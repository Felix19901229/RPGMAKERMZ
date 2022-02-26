import { TextManager } from "../Manager/index.js";
import { Window_Selectable } from "./index.js";
export class Window_Gold extends Window_Selectable {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    }
    ;
    colSpacing() {
        return 0;
    }
    ;
    refresh() {
        const rect = this.itemLineRect(0);
        const x = rect.x;
        const y = rect.y;
        const width = rect.width;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
    }
    ;
    value() {
        return window.$gameParty.gold();
    }
    ;
    currencyUnit() {
        return TextManager.currencyUnit;
    }
    ;
    open() {
        this.refresh();
        Window_Selectable.prototype.open.call(this);
    }
    ;
}
