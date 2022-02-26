import { Rectangle } from "../Core/index.js";
import { Window_Selectable ,Window_ShopStatus} from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_ShopBuy
 * 
 * The window for selecting an item to buy on the shop screen.
*/
export class Window_ShopBuy extends Window_Selectable {
    _money: number;
    _shopGoods: number[];
    _data: (Item | Weapon | Armor)[];
    _price: number[];
    _statusWindow: Window_ShopStatus;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect:Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._money = 0;
    };

    public setupGoods(shopGoods) {
        this._shopGoods = shopGoods;
        this.refresh();
        this.select(0);
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

    public setMoney(money) {
        this._money = money;
        this.refresh();
    };

    public isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    };

    public price(item) {
        return this._price[this._data.indexOf(item)] || 0;
    };

    public isEnabled(item) {
        return (
            item && this.price(item) <= this._money && !window.$gameParty.hasMaxItems(item)
        );
    };

    public refresh() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    };

    public makeItemList() {
        this._data = [];
        this._price = [];
        for (const goods of this._shopGoods) {
            const item = this.goodsToItem(goods);
            if (item) {
                this._data.push(item);
                this._price.push(goods[2] === 0 ? item.price : goods[3]);
            }
        }
    };

    public goodsToItem(goods) {
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
    };

    public drawItem(index) {
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
    };

    public priceWidth() {
        return 96;
    };

    public setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    };

    public updateHelp() {
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setItem(this.item());
        }
    };

}
