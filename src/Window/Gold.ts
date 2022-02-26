import { Rectangle } from "../Core/index.js";
import { TextManager } from "../Manager/index.js";
import { Window_Selectable } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_Gold
 * 
 * The window for displaying the party's gold.
*/
export class Window_Gold extends Window_Selectable {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);

    }

    public initialize(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };

    public colSpacing() {
        return 0;
    };

    public refresh() {
        const rect = this.itemLineRect(0);
        const x = rect.x;
        const y = rect.y;
        const width = rect.width;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
    };

    public value() {
        return window.$gameParty.gold();
    };

    public currencyUnit() {
        return TextManager.currencyUnit;
    };

    public open() {
        this.refresh();
        Window_Selectable.prototype.open.call(this);
    };
}