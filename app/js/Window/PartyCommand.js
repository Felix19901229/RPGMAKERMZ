import { TextManager, BattleManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
export class Window_PartyCommand extends Window_Command {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.deactivate();
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.fight, "fight");
        this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    }
    ;
    setup() {
        this.refresh();
        this.forceSelect(0);
        this.activate();
        this.open();
    }
    ;
}
