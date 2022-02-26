import { Rectangle } from "../Core/index.js";
import { TextManager, ConfigManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_Options
 * 
 * The window for changing various settings on the options screen.
*/
export class Window_Options extends Window_Command {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    public makeCommandList() {
        this.addGeneralOptions();
        this.addVolumeOptions();
    };

    public addGeneralOptions() {
        this.addCommand(TextManager.alwaysDash, "alwaysDash");
        this.addCommand(TextManager.commandRemember, "commandRemember");
        this.addCommand(TextManager.touchUI, "touchUI");
    };

    public addVolumeOptions() {
        this.addCommand(TextManager.bgmVolume, "bgmVolume");
        this.addCommand(TextManager.bgsVolume, "bgsVolume");
        this.addCommand(TextManager.meVolume, "meVolume");
        this.addCommand(TextManager.seVolume, "seVolume");
    };

    public drawItem(index) {
        const title = this.commandName(index);
        const status = this.statusText(index);
        const rect = this.itemLineRect(index);
        const statusWidth = this.statusWidth();
        const titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(title, rect.x, rect.y, titleWidth, "left");
        this.drawText(status, rect.x + titleWidth, rect.y, statusWidth, "right");
    };

    public statusWidth() {
        return 120;
    };

    public statusText(index) {
        const symbol = this.commandSymbol(index);
        const value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        } else {
            return this.booleanStatusText(value);
        }
    };

    public isVolumeSymbol(symbol) {
        return symbol.includes("Volume");
    };

    public booleanStatusText(value) {
        return value ? "ON" : "OFF";
    };

    public volumeStatusText(value) {
        return value + "%";
    };

    public processOk() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, true);
        } else {
            this.changeValue(symbol, !this.getConfigValue(symbol));
        }
    };

    public cursorRight() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, false);
        } else {
            this.changeValue(symbol, true);
        }
    };

    public cursorLeft() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, false, false);
        } else {
            this.changeValue(symbol, false);
        }
    };

    public changeVolume(symbol, forward, wrap) {
        const lastValue = this.getConfigValue(symbol);
        const offset = this.volumeOffset();
        const value = lastValue + (forward ? offset : -offset);
        if (value > 100 && wrap) {
            this.changeValue(symbol, 0);
        } else {
            this.changeValue(symbol, value.clamp(0, 100));
        }
    };

    public volumeOffset() {
        return 20;
    };

    public changeValue(symbol, value) {
        const lastValue = this.getConfigValue(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            this.playCursorSound();
        }
    };

    public getConfigValue(symbol) {
        return ConfigManager[symbol];
    };

    public setConfigValue(symbol, volume) {
        ConfigManager[symbol] = volume;
    };


}
