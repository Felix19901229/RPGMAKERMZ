import { Window_ItemList } from "./index.js";
export class Window_ShopSell extends Window_ItemList {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_ItemList.prototype.initialize.call(this, rect);
    }
    ;
    isEnabled(item) {
        return item && item.price > 0;
    }
    ;
}
