
import { Rectangle } from "../Core/index.js";
import { Game_Action } from "../Game/index.js";
import { DataManager } from "../Manager/index.js";
import { Window_MenuStatus } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_MenuActor
 * 
 * The window for selecting a target actor on the item and skill screens.
*/
export class Window_MenuActor extends Window_MenuStatus {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
        this.hide();
    };

    public processOk() {
        if (!this.cursorAll()) {
            window.$gameParty.setTargetActor(window.$gameParty.members()[this.index()]);
        }
        this.callOkHandler();
    };

    public selectLast() {
        this.forceSelect(window.$gameParty.targetActor().index() || 0);
    };

    public selectForItem(item) {
        const actor = window.$gameParty.menuActor();
        const action = new Game_Action(actor);
        action.setItemObject(item);
        this.setCursorFixed(false);
        this.setCursorAll(false);
        if (action.isForUser()) {
            if (DataManager.isSkill(item)) {
                this.setCursorFixed(true);
                this.forceSelect(actor.index());
            } else {
                this.selectLast();
            }
        } else if (action.isForAll()) {
            this.setCursorAll(true);
            this.forceSelect(0);
        } else {
            this.selectLast();
        }
    };
}
