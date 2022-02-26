import { Rectangle } from "../Core/index.js";
import { TextManager, DataManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_TitleCommand
 * 
 * The window for selecting New Game/Continue on the title screen.
*/
export class Window_TitleCommand extends Window_Command {
    static _lastCommandSymbol = null;

    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.selectLast();
    };


    static initCommandPosition() {
        this._lastCommandSymbol = null;
    };

    public makeCommandList() {
        const continueEnabled = this.isContinueEnabled();
        this.addCommand(TextManager.newGame, "newGame");
        this.addCommand(TextManager.continue_, "continue", continueEnabled);
        this.addCommand(TextManager.options, "options");
    };

    public isContinueEnabled() {
        return DataManager.isAnySavefileExists();
    };

    public processOk() {
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        Window_Command.prototype.processOk.call(this);
    };

    public selectLast() {
        if (Window_TitleCommand._lastCommandSymbol) {
            this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
        } else if (this.isContinueEnabled()) {
            this.selectSymbol("continue");
        }
    };

}
