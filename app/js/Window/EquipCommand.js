import { TextManager } from "../Manager/index.js";
import { Window_HorzCommand } from "./index.js";
export class Window_EquipCommand extends Window_HorzCommand {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    }
    ;
    maxCols() {
        return 3;
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.equip2, "equip");
        this.addCommand(TextManager.optimize, "optimize");
        this.addCommand(TextManager.clear, "clear");
    }
    ;
}
