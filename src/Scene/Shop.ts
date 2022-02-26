import { Graphics, Rectangle } from "../Core/index.js";
import { SoundManager } from "../Manager/index.js";
import { Window_Gold, Window_ShopCommand, Window_Base, Window_ShopNumber, Window_ShopStatus, Window_ItemCategory, Window_ShopSell } from "../Window/index.js";
import { Window_ShopBuy } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Shop
 * 
 * The scene class of the shop screen.
*/
export class Scene_Shop extends Scene_MenuBase {
    _goods: Item;
    _purchaseOnly: any;
    _item: Item | Weapon | Armor;
    _goldWindow: Nullable<Window_Gold>;
    _commandWindow: Nullable<Window_ShopCommand>;
    _dummyWindow: Nullable<Window_Base>;
    _numberWindow: Nullable<Window_ShopNumber>;
    _statusWindow: Nullable<Window_ShopStatus>;
    _buyWindow: Nullable<Window_ShopBuy>;
    _categoryWindow: Nullable<Window_ItemCategory>;
    _sellWindow: Nullable<Window_ShopSell>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    public prepare(goods, purchaseOnly) {
        this._goods = goods;
        this._purchaseOnly = purchaseOnly;
        this._item = null;
    };

    public create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createNumberWindow();
        this.createStatusWindow();
        this.createBuyWindow();
        this.createCategoryWindow();
        this.createSellWindow();
    };

    public createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    };

    public goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    public createCommandWindow() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_ShopCommand(rect);
        this._commandWindow.setPurchaseOnly(this._purchaseOnly);
        this._commandWindow.y = this.mainAreaTop();
        this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
        this._commandWindow.setHandler("sell", this.commandSell.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };

    public commandWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this._goldWindow.x;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    public createDummyWindow() {
        const rect = this.dummyWindowRect();
        this._dummyWindow = new Window_Base(rect);
        this.addWindow(this._dummyWindow);
    };

    public dummyWindowRect() {
        const wx = 0;
        const wy = this._commandWindow.y + this._commandWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._commandWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createNumberWindow() {
        const rect = this.numberWindowRect();
        this._numberWindow = new Window_ShopNumber(rect);
        this._numberWindow.hide();
        this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
        this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    };

    public numberWindowRect() {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this._dummyWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_ShopStatus(rect);
        this._statusWindow.hide();
        this.addWindow(this._statusWindow);
    };

    public statusWindowRect() {
        const ww = this.statusWidth();
        const wh = this._dummyWindow.height;
        const wx = Graphics.boxWidth - ww;
        const wy = this._dummyWindow.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createBuyWindow() {
        const rect = this.buyWindowRect();
        this._buyWindow = new Window_ShopBuy(rect);
        this._buyWindow.setupGoods(this._goods);
        this._buyWindow.setHelpWindow(this._helpWindow);
        this._buyWindow.setStatusWindow(this._statusWindow);
        this._buyWindow.hide();
        this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
        this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
        this.addWindow(this._buyWindow);
    };

    public buyWindowRect() {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this._dummyWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createCategoryWindow() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
    };

    public categoryWindowRect() {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    public createSellWindow() {
        const rect = this.sellWindowRect();
        this._sellWindow = new Window_ShopSell(rect);
        this._sellWindow.setHelpWindow(this._helpWindow);
        this._sellWindow.hide();
        this._sellWindow.setHandler("ok", this.onSellOk.bind(this));
        this._sellWindow.setHandler("cancel", this.onSellCancel.bind(this));
        this._categoryWindow.setItemWindow(this._sellWindow);
        this.addWindow(this._sellWindow);
        if (!this._categoryWindow.needsSelection()) {
            this._sellWindow.y -= this._categoryWindow.height;
            this._sellWindow.height += this._categoryWindow.height;
        }
    };

    public sellWindowRect() {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = Graphics.boxWidth;
        const wh =
            this.mainAreaHeight() -
            this._commandWindow.height -
            this._categoryWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    public statusWidth() {
        return 352;
    };

    public activateBuyWindow() {
        this._buyWindow.setMoney(this.money());
        this._buyWindow.show();
        this._buyWindow.activate();
        this._statusWindow.show();
    };

    public activateSellWindow() {
        if (this._categoryWindow.needsSelection()) {
            this._categoryWindow.show();
        }
        this._sellWindow.refresh();
        this._sellWindow.show();
        this._sellWindow.activate();
        this._statusWindow.hide();
    };

    public commandBuy() {
        this._dummyWindow.hide();
        this.activateBuyWindow();
    };

    public commandSell() {
        this._dummyWindow.hide();
        this._sellWindow.show();
        this._sellWindow.deselect();
        this._sellWindow.refresh();
        if (this._categoryWindow.needsSelection()) {
            this._categoryWindow.show();
            this._categoryWindow.activate();
        } else {
            this.onCategoryOk();
        }
    };

    public onBuyOk() {
        this._item = this._buyWindow.item();
        this._buyWindow.hide();
        this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
    };

    public onBuyCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._buyWindow.hide();
        this._statusWindow.hide();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    };

    public onCategoryOk() {
        this.activateSellWindow();
        this._sellWindow.select(0);
    };

    public onCategoryCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._categoryWindow.hide();
        this._sellWindow.hide();
    };

    public onSellOk() {
        this._item = this._sellWindow.item();
        this._categoryWindow.hide();
        this._sellWindow.hide();
        this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item);
        this._statusWindow.show();
    };

    public onSellCancel() {
        this._sellWindow.deselect();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
        if (this._categoryWindow.needsSelection()) {
            this._categoryWindow.activate();
        } else {
            this.onCategoryCancel();
        }
    };

    public onNumberOk() {
        SoundManager.playShop();
        switch (this._commandWindow.currentSymbol()) {
            case "buy":
                this.doBuy(this._numberWindow.number());
                break;
            case "sell":
                this.doSell(this._numberWindow.number());
                break;
        }
        this.endNumberInput();
        this._goldWindow.refresh();
        this._statusWindow.refresh();
    };

    public onNumberCancel() {
        SoundManager.playCancel();
        this.endNumberInput();
    };

    public doBuy(number) {
        window.$gameParty.loseGold(number * this.buyingPrice());
        window.$gameParty.gainItem(this._item, number);
    };

    public doSell(number) {
        window.$gameParty.gainGold(number * this.sellingPrice());
        window.$gameParty.loseItem(this._item, number);
    };

    public endNumberInput() {
        this._numberWindow.hide();
        switch (this._commandWindow.currentSymbol()) {
            case "buy":
                this.activateBuyWindow();
                break;
            case "sell":
                this.activateSellWindow();
                break;
        }
    };

    public maxBuy() {
        const num = window.$gameParty.numItems(this._item);
        const max = window.$gameParty.maxItems(this._item) - num;
        const price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        } else {
            return max;
        }
    };

    public maxSell() {
        return window.$gameParty.numItems(this._item);
    };

    public money() {
        return this._goldWindow.value();
    };

    public currencyUnit() {
        return this._goldWindow.currencyUnit();
    };

    public buyingPrice() {
        return this._buyWindow.price(this._item);
    };

    public sellingPrice() {
        return Math.floor(this._item.price / 2);
    };
}
