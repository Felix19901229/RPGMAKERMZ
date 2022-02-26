import { Rectangle } from "../Core/index.js";
import { TextManager } from "../Manager/index.js";
import { Window_HorzCommand,Window_ItemList } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_ItemCategorys
 * 
 * The window for selecting a category of items on the item and shop screens.
*/
export class Window_ItemCategory extends Window_HorzCommand {
    _itemWindow: Window_ItemList;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    };

    public maxCols() {
        return 4;
    };

    public update() {
        Window_HorzCommand.prototype.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    };

    public makeCommandList() {
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
    };

    public needsCommand(name) {
        const table = ["item", "weapon", "armor", "keyItem"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return window.$dataSystem.itemCategories[index];
        }
        return true;
    };

    public setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
    };

    public needsSelection() {
        return this.maxItems() >= 2;
    };
}

