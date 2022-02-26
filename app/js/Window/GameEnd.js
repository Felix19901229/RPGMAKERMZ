import { TextManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
export class Window_GameEnd extends Window_Command {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.open();
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.toTitle, "toTitle");
        this.addCommand(TextManager.cancel, "cancel");
    }
    ;
}
