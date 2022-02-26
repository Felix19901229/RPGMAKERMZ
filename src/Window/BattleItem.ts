import { Rectangle } from "../Core/index.js";
import { Window_ItemList } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_BattleItem
 * 
 * The window for selecting an item to use on the battle screen.
*/
export class Window_BattleItem extends Window_ItemList {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect:Rectangle) {
        Window_ItemList.prototype.initialize.call(this, rect);
        this.hide();
    };

    public includes(item) {
        return window.$gameParty.canUse(item);
    };

    public show() {
        this.selectLast();
        this.showHelpWindow();
        Window_ItemList.prototype.show.call(this);
    };

    public hide() {
        this.hideHelpWindow();
        Window_ItemList.prototype.hide.call(this);
    };


}
