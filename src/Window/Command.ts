import { Rectangle } from "../Core/index.js";
import { Window_Selectable } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_Command
 * 
 * The superclass of windows for selecting a command.
*/
export class Window_Command extends Window_Selectable {
    _list: { name: string; symbol: string; enabled: boolean; ext: string }[];
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.select(0);
        this.activate();
    };

    public maxItems() {
        return this._list.length;
    };

    public clearCommandList() {
        this._list = [];
    };

    public makeCommandList() {
        //
    };

    public addCommand(name, symbol, enabled = true, ext = null) {
        this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
    };

    public commandName(index) {
        return this._list[index].name;
    };

    public commandSymbol(index) {
        return this._list[index].symbol;
    };

    public isCommandEnabled(index) {
        return this._list[index].enabled;
    };

    public currentData() {
        return this.index() >= 0 ? this._list[this.index()] : null;
    };

    public isCurrentItemEnabled() {
        return this.currentData() ? this.currentData().enabled : false;
    };

    public currentSymbol() {
        return this.currentData() ? this.currentData().symbol : null;
    };

    public currentExt() {
        return this.currentData() ? this.currentData().ext : null;
    };

    public findSymbol(symbol) {
        return this._list.findIndex(item => item.symbol === symbol);
    };

    public selectSymbol(symbol) {
        const index = this.findSymbol(symbol);
        if (index >= 0) {
            this.forceSelect(index);
        } else {
            this.forceSelect(0);
        }
    };

    public findExt(ext) {
        return this._list.findIndex(item => item.ext === ext);
    };

    public selectExt(ext) {
        const index = this.findExt(ext);
        if (index >= 0) {
            this.forceSelect(index);
        } else {
            this.forceSelect(0);
        }
    };

    public drawItem(index) {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    };

    public itemTextAlign() {
        return "center";
    };

    public isOkEnabled() {
        return true;
    };

    public callOkHandler() {
        const symbol = this.currentSymbol();
        if (this.isHandled(symbol)) {
            this.callHandler(symbol);
        } else if (this.isHandled("ok")) {
            Window_Selectable.prototype.callOkHandler.call(this);
        } else {
            this.activate();
        }
    };

    public refresh() {
        this.clearCommandList();
        this.makeCommandList();
        Window_Selectable.prototype.refresh.call(this);
    };
}

