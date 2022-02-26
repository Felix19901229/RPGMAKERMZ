import { Rectangle } from "../Core/index.js";
import { TextManager, DataManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_MenuCommand
 * 
 * The window for selecting a command on the menu screen.
*/
export class Window_MenuCommand extends Window_Command {
    static _lastCommandSymbol = null;

    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
        this.selectLast();
        this._canRepeat = false;
    };

    static initCommandPosition() {
        this._lastCommandSymbol = null;
    };

    public makeCommandList() {
        this.addMainCommands();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    };

    public addMainCommands() {
        const enabled = this.areMainCommandsEnabled();
        if (this.needsCommand("item")) {
            this.addCommand(TextManager.item, "item", enabled);
        }
        if (this.needsCommand("skill")) {
            this.addCommand(TextManager.skill, "skill", enabled);
        }
        if (this.needsCommand("equip")) {
            this.addCommand(TextManager.equip, "equip", enabled);
        }
        if (this.needsCommand("status")) {
            this.addCommand(TextManager.status, "status", enabled);
        }
    };

    public addFormationCommand() {
        if (this.needsCommand("formation")) {
            const enabled = this.isFormationEnabled();
            this.addCommand(TextManager.formation, "formation", enabled);
        }
    };

    public addOriginalCommands() {
        //
    };

    public addOptionsCommand() {
        if (this.needsCommand("options")) {
            const enabled = this.isOptionsEnabled();
            this.addCommand(TextManager.options, "options", enabled);
        }
    };

    public addSaveCommand() {
        if (this.needsCommand("save")) {
            const enabled = this.isSaveEnabled();
            this.addCommand(TextManager.save, "save", enabled);
        }
    };

    public addGameEndCommand() {
        const enabled = this.isGameEndEnabled();
        this.addCommand(TextManager.gameEnd, "gameEnd", enabled);
    };

    public needsCommand(name) {
        const table = ["item", "skill", "equip", "status", "formation", "save"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return window.$dataSystem.menuCommands[index];
        }
        return true;
    };

    public areMainCommandsEnabled() {
        return window.$gameParty.exists();
    };

    public isFormationEnabled() {
        return window.$gameParty.size() >= 2 && window.$gameSystem.isFormationEnabled();
    };

    public isOptionsEnabled() {
        return true;
    };

    public isSaveEnabled() {
        return !DataManager.isEventTest() && window.$gameSystem.isSaveEnabled();
    };

    public isGameEndEnabled() {
        return true;
    };

    public processOk() {
        Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
        Window_Command.prototype.processOk.call(this);
    };

    public selectLast() {
        this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
    };
}
