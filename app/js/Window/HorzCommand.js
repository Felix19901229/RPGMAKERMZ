import { Window_Command } from "./index.js";
export class Window_HorzCommand extends Window_Command {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    }
    ;
    maxCols() {
        return 4;
    }
    ;
    itemTextAlign() {
        return "center";
    }
    ;
}
