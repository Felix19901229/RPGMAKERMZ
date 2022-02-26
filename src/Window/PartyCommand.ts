import { Rectangle } from "../Core/index.js";
import { TextManager, BattleManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_PartyCommand
 * 
 * The window for selecting whether to fight or escape on the battle screen.
*/
export class Window_PartyCommand extends Window_Command {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.deactivate();
    };

    public makeCommandList() {
        this.addCommand(TextManager.fight, "fight");
        this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    };

    public setup() {
        this.refresh();
        this.forceSelect(0);
        this.activate();
        this.open();
    };
}
