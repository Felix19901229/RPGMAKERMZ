
import { Rectangle } from "../Core/index.js";
import { Window_Command } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_HorzCommand
 * 
 * The command window for the horizontal selection format.
*/
export class Window_HorzCommand extends Window_Command {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);

    }


    public initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    public maxCols() {
        return 4;
    };

    public itemTextAlign() {
        return "center";
    };
}

