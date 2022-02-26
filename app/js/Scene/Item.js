import { Graphics, Rectangle } from "../Core/index.js";
import { SoundManager } from "../Manager/index.js";
import { Window_ItemCategory, Window_ItemList } from "../Window/index.js";
import { Scene_ItemBase } from "./index.js";
export class Scene_Item extends Scene_ItemBase {
    _categoryWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(...args) {
        Scene_ItemBase.prototype.initialize.call(this);
    }
    ;
    create() {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
    }
    ;
    createCategoryWindow() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    }
    ;
    categoryWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    createItemWindow() {
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
    }
    ;
    itemWindowRect() {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    user() {
        const members = window.$gameParty.movableMembers();
        const bestPha = Math.max(...members.map(member => member.pha));
        return members.find(member => member.pha === bestPha);
    }
    ;
    onCategoryOk() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    }
    ;
    onItemOk() {
        window.$gameParty.setLastItem(this.item());
        this.determineItem();
    }
    ;
    onItemCancel() {
        if (this._categoryWindow.needsSelection()) {
            this._itemWindow.deselect();
            this._categoryWindow.activate();
        }
        else {
            this.popScene();
        }
    }
    ;
    playSeForItem() {
        SoundManager.playUseItem();
    }
    ;
    useItem() {
        Scene_ItemBase.prototype.useItem.call(this);
        this._itemWindow.redrawCurrentItem();
    }
    ;
}
