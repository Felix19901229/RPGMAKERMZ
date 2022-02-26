import { DataManager } from "../Manager/index.js";
import { Window_Selectable } from "./index.js";
export class Window_ItemList extends Window_Selectable {
    _category;
    _data;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._category = "none";
        this._data = [];
    }
    ;
    setCategory(category) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }
    ;
    maxCols() {
        return 2;
    }
    ;
    colSpacing() {
        return 16;
    }
    ;
    maxItems() {
        return this._data ? this._data.length : 1;
    }
    ;
    item() {
        return this.itemAt(this.index());
    }
    ;
    itemAt(index) {
        return this._data && index >= 0 ? this._data[index] : null;
    }
    ;
    isCurrentItemEnabled() {
        return this.isEnabled(this.item());
    }
    ;
    includes(item) {
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
    }
    ;
    needsNumber() {
        if (this._category === "keyItem") {
            return window.$dataSystem.optKeyItemsNumber;
        }
        else {
            return true;
        }
    }
    ;
    isEnabled(item) {
        return window.$gameParty.canUse(item);
    }
    ;
    makeItemList() {
        this._data = window.$gameParty.allItems().filter(item => this.includes(item));
        if (this.includes(null)) {
            this._data.push(null);
        }
    }
    ;
    selectLast() {
        const index = this._data.indexOf(window.$gameParty.lastItem());
        this.forceSelect(index >= 0 ? index : 0);
    }
    ;
    drawItem(index) {
        const item = this.itemAt(index);
        if (item) {
            const numberWidth = this.numberWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    }
    ;
    numberWidth() {
        return this.textWidth("000");
    }
    ;
    drawItemNumber(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(":", x, y, width - this.textWidth("00"), "right");
            this.drawText(window.$gameParty.numItems(item), x, y, width, "right");
        }
    }
    ;
    updateHelp() {
        this.setHelpWindowItem(this.item());
    }
    ;
    refresh() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    }
    ;
}
