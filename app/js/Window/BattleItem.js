import { Window_ItemList } from "./index.js";
export class Window_BattleItem extends Window_ItemList {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_ItemList.prototype.initialize.call(this, rect);
        this.hide();
    }
    ;
    includes(item) {
        return window.$gameParty.canUse(item);
    }
    ;
    show() {
        this.selectLast();
        this.showHelpWindow();
        Window_ItemList.prototype.show.call(this);
    }
    ;
    hide() {
        this.hideHelpWindow();
        Window_ItemList.prototype.hide.call(this);
    }
    ;
}
