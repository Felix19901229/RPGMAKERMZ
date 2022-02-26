import { Graphics, Rectangle } from "../Core/index.js";
import { SoundManager } from "../Manager/index.js";
import { Window_ItemCategory, Window_ItemList } from "../Window/index.js";
import { Scene_ItemBase } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Item
 * 
 * The scene class of the item screen.
*/
export class Scene_Item extends Scene_ItemBase {
    _categoryWindow: Window_ItemCategory;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_ItemBase.prototype.initialize.call(this);
    };

    public create() {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
    };

    public createCategoryWindow() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    };

    public categoryWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    public createItemWindow() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_ItemList(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
        if (!this._categoryWindow.needsSelection()) {
            this._itemWindow.y -= this._categoryWindow.height;
            this._itemWindow.height += this._categoryWindow.height;
            this._itemWindow.createContents();
            this._categoryWindow.update();
            this._categoryWindow.hide();
            this._categoryWindow.deactivate();
            this.onCategoryOk();
        }
    };

    public itemWindowRect() {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    public user() {
        const members = window.$gameParty.movableMembers();
        const bestPha = Math.max(...members.map(member => member.pha));
        return members.find(member => member.pha === bestPha);
    };

    public onCategoryOk() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    };

    public onItemOk() {
        window.$gameParty.setLastItem(this.item());
        this.determineItem();
    };

    public onItemCancel() {
        if (this._categoryWindow.needsSelection()) {
            this._itemWindow.deselect();
            this._categoryWindow.activate();
        } else {
            this.popScene();
        }
    };

    public playSeForItem() {
        SoundManager.playUseItem();
    };

    public useItem() {
        Scene_ItemBase.prototype.useItem.call(this);
        this._itemWindow.redrawCurrentItem();
    };
}
