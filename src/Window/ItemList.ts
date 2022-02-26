import { Rectangle } from "../Core/index.js";
import { DataManager } from "../Manager/index.js";
import { Window_Selectable } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_ItemList
 * 
 * The window for selecting an item on the item screen.
*/
export class Window_ItemList extends Window_Selectable {
    _category: string;
    _data: (Item | Weapon)[];
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect:Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._category = "none";
        this._data = [];
    };

    public setCategory(category) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.scrollTo(0, 0);
        }
    };

    public maxCols() {
        return 2;
    };

    public colSpacing() {
        return 16;
    };

    public maxItems() {
        return this._data ? this._data.length : 1;
    };

    public item() {
        return this.itemAt(this.index());
    };

    public itemAt(index) {
        return this._data && index >= 0 ? this._data[index] : null;
    };

    public isCurrentItemEnabled() {
        return this.isEnabled(this.item());
    };

    public includes(item) {
        switch (this._category) {
            case "item":
                return DataManager.isItem(item) && item.itypeId === 1;
            case "weapon":
                return DataManager.isWeapon(item);
            case "armor":
                return DataManager.isArmor(item);
            case "keyItem":
                return DataManager.isItem(item) && item.itypeId === 2;
            default:
                return false;
        }
    };

    public needsNumber() {
        if (this._category === "keyItem") {
            return window.$dataSystem.optKeyItemsNumber;
        } else {
            return true;
        }
    };

    public isEnabled(item) {
        return window.$gameParty.canUse(item);
    };

    public makeItemList() {
        this._data = window.$gameParty.allItems().filter(item => this.includes(item));
        if (this.includes(null)) {
            this._data.push(null);
        }
    };

    public selectLast() {
        //@ts-ignore
        const index = this._data.indexOf(window.$gameParty.lastItem());
        this.forceSelect(index >= 0 ? index : 0);
    };

    public drawItem(index) {
        const item = this.itemAt(index);
        if (item) {
            const numberWidth = this.numberWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    public numberWidth() {
        return this.textWidth("000");
    };

    public drawItemNumber(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(":", x, y, width - this.textWidth("00"), "right");
            this.drawText(window.$gameParty.numItems(item), x, y, width, "right");
        }
    };

    public updateHelp() {
        this.setHelpWindowItem(this.item());
    };

    public refresh() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    };
}
