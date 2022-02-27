import { TextManager, DataManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
export class Window_TitleCommand extends Window_Command {
    static _lastCommandSymbol = null;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.selectLast();
    }
    ;
    static initCommandPosition() {
        this._lastCommandSymbol = null;
    }
    ;
    makeCommandList() {
        const continueEnabled = this.isContinueEnabled();
        this.addCommand(TextManager.newGame, "newGame");
        this.addCommand(TextManager.continue_, "continue", continueEnabled);
        this.addCommand(TextManager.options, "options");
    }
    ;
    isContinueEnabled() {
        return DataManager.isAnySavefileExists();
    }
    ;
    processOk() {
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }
    ;
    selectLast() {
        if (Window_TitleCommand._lastCommandSymbol) {
            this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
        }
        else if (this.isContinueEnabled()) {
            this.selectSymbol("continue");
        }
    }
    ;
}
