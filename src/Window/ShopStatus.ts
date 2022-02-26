import { Input, Rectangle, TouchInput } from "../Core/index.js";
import { DataManager, ColorManager, TextManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_ShopStatus
 * 
 * The window for displaying number of items in possession and the actor's
 * equipment on the shop screen.
*/
export class Window_ShopStatus extends Window_StatusBase {
    _item: Weapon | Armor;
    _pageIndex: number;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._item = null;
        this._pageIndex = 0;
        this.refresh();
    };

    public refresh() {
        this.contents.clear();
        if (this._item) {
            const x = this.itemPadding();
            this.drawPossession(x, 0);
            if (this.isEquipItem()) {
                const y = Math.floor(this.lineHeight() * 1.5);
                this.drawEquipInfo(x, y);
            }
        }
    };

    public setItem(item) {
        this._item = item;
        this.refresh();
    };

    public isEquipItem() {
        return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
    };

    public drawPossession(x, y) {
        const width = this.innerWidth - this.itemPadding() - x;
        const possessionWidth = this.textWidth("0000");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.possession, x, y, width - possessionWidth);
        this.resetTextColor();
        this.drawText(window.$gameParty.numItems(this._item), x, y, width, "right");
    };

    public drawEquipInfo(x, y) {
        const members = this.statusMembers();
        for (let i = 0; i < members.length; i++) {
            const actorY = y + Math.floor(this.lineHeight() * i * 2.2);
            this.drawActorEquipInfo(x, actorY, members[i]);
        }
    };

    public statusMembers() {
        const start = this._pageIndex * this.pageSize();
        const end = start + this.pageSize();
        return window.$gameParty.members().slice(start, end);
    };

    public pageSize() {
        return 4;
    };

    public maxPages() {
        return Math.floor(
            (window.$gameParty.size() + this.pageSize() - 1) / this.pageSize()
        );
    };

    public drawActorEquipInfo(x, y, actor) {
        const item1 = this.currentEquippedItem(actor, this._item.etypeId);
        const width = this.innerWidth - x - this.itemPadding();
        const enabled = actor.canEquip(this._item);
        this.changePaintOpacity(enabled);
        this.resetTextColor();
        this.drawText(actor.name(), x, y, width);
        if (enabled) {
            this.drawActorParamChange(x, y, actor, item1);
        }
        this.drawItemName(item1, x, y + this.lineHeight(), width);
        this.changePaintOpacity(true);
    };

    public drawActorParamChange(x, y, actor, item1) {
        const width = this.innerWidth - this.itemPadding() - x;
        const paramId = this.paramId();
        const change = this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
        this.changeTextColor(ColorManager.paramchangeTextColor(change));
        this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
    };

    public paramId() {
        return DataManager.isWeapon(this._item) ? 2 : 3;
    };

    public currentEquippedItem(actor, etypeId) {
        const list = [];
        const equips = actor.equips();
        const slots = actor.equipSlots();
        for (let i = 0; i < slots.length; i++) {
            if (slots[i] === etypeId) {
                list.push(equips[i]);
            }
        }
        const paramId = this.paramId();
        let worstParam = Number.MAX_VALUE;
        let worstItem = null;
        for (const item of list) {
            if (item && item.params[paramId] < worstParam) {
                worstParam = item.params[paramId];
                worstItem = item;
            }
        }
        return worstItem;
    };

    public update() {
        Window_StatusBase.prototype.update.call(this);
        this.updatePage();
    };

    public updatePage() {
        if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
            this.changePage();
        }
    };

    public isPageChangeEnabled() {
        return this.visible && this.maxPages() >= 2;
    };

    public isPageChangeRequested() {
        if (Input.isTriggered("shift")) {
            return true;
        }
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            return true;
        }
        return false;
    };

    public changePage() {
        this._pageIndex = (this._pageIndex + 1) % this.maxPages();
        this.refresh();
        this.playCursorSound();
    };

}
