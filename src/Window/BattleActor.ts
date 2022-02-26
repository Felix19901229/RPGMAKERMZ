import { Rectangle } from "../Core/index.js";
import { Window_BattleStatus } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_BattleActor
 * 
 * The window for selecting a target actor on the battle screen.
*/
export class Window_BattleActor extends Window_BattleStatus {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_BattleStatus.prototype.initialize.call(this, rect);
        this.openness = 255;
        this.hide();
    };

    public show() {
        this.forceSelect(0);
        window.$gameTemp.clearTouchState();
        Window_BattleStatus.prototype.show.call(this);
    };

    public hide() {
        Window_BattleStatus.prototype.hide.call(this);
        window.$gameParty.select(null);
    };

    public select(index) {
        Window_BattleStatus.prototype.select.call(this, index);
        window.$gameParty.select(this.actor(index));
    };

    public processTouch() {
        Window_BattleStatus.prototype.processTouch.call(this);
        if (this.isOpenAndActive()) {
            const target = window.$gameTemp.touchTarget();
            if (target) {
                const members = window.$gameParty.battleMembers();
                if (members.includes(target)) {
                    this.select(members.indexOf(target));
                    if (window.$gameTemp.touchState() === "click") {
                        this.processOk();
                    }
                }
                window.$gameTemp.clearTouchState();
            }
        }
    };
}
