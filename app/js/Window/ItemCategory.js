import { TextManager } from "../Manager/index.js";
import { Window_HorzCommand } from "./index.js";
export class Window_ItemCategory extends Window_HorzCommand {
    _itemWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    }
    ;
    maxCols() {
        return 4;
    }
    ;
    update() {
        Window_HorzCommand.prototype.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    }
    ;
    makeCommandList() {
        if (this.needsCommand("item")) {
            this.addCommand(TextManager.item, "item");
        }
        if (this.needsCommand("weapon")) {
            this.addCommand(TextManager.weapon, "weapon");
        }
        if (this.needsCommand("armor")) {
            this.addCommand(TextManager.armor, "armor");
        }
        if (this.needsCommand("keyItem")) {
            this.addCommand(TextManager.keyItem, "keyItem");
        }
    }
    ;
    needsCommand(name) {
        const table = ["item", "weapon", "armor", "keyItem"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return window.$dataSystem.itemCategories[index];
        }
        return true;
    }
    ;
    setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
    }
    ;
    needsSelection() {
        return this.maxItems() >= 2;
    }
    ;
}
