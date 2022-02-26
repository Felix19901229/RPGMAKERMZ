import { Game_Action } from "../Game/index.js";
import { DataManager } from "../Manager/index.js";
import { Window_MenuStatus } from "./index.js";
export class Window_MenuActor extends Window_MenuStatus {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
        this.hide();
    }
    ;
    processOk() {
        if (!this.cursorAll()) {
            window.$gameParty.setTargetActor(window.$gameParty.members()[this.index()]);
        }
        this.callOkHandler();
    }
    ;
    selectLast() {
        this.forceSelect(window.$gameParty.targetActor().index() || 0);
    }
    ;
    selectForItem(item) {
        const actor = window.$gameParty.menuActor();
        const action = new Game_Action(actor);
        action.setItemObject(item);
        this.setCursorFixed(false);
        this.setCursorAll(false);
        if (action.isForUser()) {
            if (DataManager.isSkill(item)) {
                this.setCursorFixed(true);
                this.forceSelect(actor.index());
            }
            else {
                this.selectLast();
            }
        }
        else if (action.isForAll()) {
            this.setCursorAll(true);
            this.forceSelect(0);
        }
        else {
            this.selectLast();
        }
    }
    ;
}
