import { Window_Selectable } from "./index.js";
export class Window_ShopBuy extends Window_Selectable {
    _money;
    _shopGoods;
    _data;
    _price;
    _statusWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._money = 0;
    }
    ;
    setupGoods(shopGoods) {
        this._shopGoods = shopGoods;
        this.refresh();
        this.select(0);
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
    setMoney(money) {
        this._money = money;
        this.refresh();
    }
    ;
    isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }
    ;
    price(item) {
        return this._price[this._data.indexOf(item)] || 0;
    }
    ;
    isEnabled(item) {
        return (item && this.price(item) <= this._money && !window.$gameParty.hasMaxItems(item));
    }
    ;
    refresh() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    }
    ;
    makeItemList() {
        this._data = [];
        this._price = [];
        for (const goods of this._shopGoods) {
            const item = this.goodsToItem(goods);
            if (item) {
                this._data.push(item);
                this._price.push(goods[2] === 0 ? item.price : goods[3]);
            }
        }
    }
    ;
    goodsToItem(goods) {
        switch (goods[0]) {
            case 0:
                return window.$dataItems[goods[1]];
            case 1:
                return window.$dataWeapons[goods[1]];
            case 2:
                return window.$dataArmors[goods[1]];
            default:
                return null;
        }
    }
    ;
    drawItem(index) {
        const item = this.itemAt(index);
        const price = this.price(item);
        const rect = this.itemLineRect(index);
        const priceWidth = this.priceWidth();
        const priceX = rect.x + rect.width - priceWidth;
        const nameWidth = rect.width - priceWidth;
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, nameWidth);
        this.drawText(price, priceX, rect.y, priceWidth, "right");
        this.changePaintOpacity(true);
    }
    ;
    priceWidth() {
        return 96;
    }
    ;
    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }
    ;
    updateHelp() {
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setItem(this.item());
        }
    }
    ;
}
