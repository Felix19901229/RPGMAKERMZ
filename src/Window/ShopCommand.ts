import { Rectangle } from "../Core/index.js";
import { TextManager } from "../Manager/index.js";
import { Window_HorzCommand } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_ShopCommand
 * 
 * The window for selecting buy/sell on the shop screen.
*/
export class Window_ShopCommand extends Window_HorzCommand {
    _purchaseOnly: any;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    };

    public setPurchaseOnly(purchaseOnly) {
        this._purchaseOnly = purchaseOnly;
        this.refresh();
    };

    public maxCols() {
        return 3;
    };

    public makeCommandList() {
        this.addCommand(TextManager.buy, "buy");
        this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
        this.addCommand(TextManager.cancel, "cancel");
    };

}
