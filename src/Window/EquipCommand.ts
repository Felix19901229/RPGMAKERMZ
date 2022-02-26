import { Rectangle } from "../Core/index.js";
import { TextManager } from "../Manager/index.js";
import { Window_HorzCommand } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_EquipCommand
 * 
 * The window for selecting a command on the equipment screen.
*/
export class Window_EquipCommand extends Window_HorzCommand {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    };

    public maxCols() {
        return 3;
    };

    public makeCommandList() {
        this.addCommand(TextManager.equip2, "equip");
        this.addCommand(TextManager.optimize, "optimize");
        this.addCommand(TextManager.clear, "clear");
    };
}
