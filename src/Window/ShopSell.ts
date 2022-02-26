import { Rectangle } from "../Core/index.js";
import { Window_ItemList } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_ShopSell
 * 
 * The window for selecting an item to sell on the shop screen.
*/
export class Window_ShopSell extends Window_ItemList {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_ItemList.prototype.initialize.call(this, rect);
    };

    public isEnabled(item) {
        return item && item.price > 0;
    };
}


