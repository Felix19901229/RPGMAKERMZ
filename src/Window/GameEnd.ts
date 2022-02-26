import { Rectangle } from "../Core/index.js";
import { TextManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_GameEnd
 * 
 * The window for selecting "Go to Title" on the game end screen.
*/
export class Window_GameEnd extends Window_Command {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.open();
    };

    public makeCommandList() {
        this.addCommand(TextManager.toTitle, "toTitle");
        this.addCommand(TextManager.cancel, "cancel");
    };
}
