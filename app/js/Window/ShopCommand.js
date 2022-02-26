import { TextManager } from "../Manager/index.js";
import { Window_HorzCommand } from "./index.js";
export class Window_ShopCommand extends Window_HorzCommand {
    _purchaseOnly;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    }
    ;
    setPurchaseOnly(purchaseOnly) {
        this._purchaseOnly = purchaseOnly;
        this.refresh();
    }
    ;
    maxCols() {
        return 3;
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.buy, "buy");
        this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
        this.addCommand(TextManager.cancel, "cancel");
    }
    ;
}
