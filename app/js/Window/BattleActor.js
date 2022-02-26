import { Window_BattleStatus } from "./index.js";
export class Window_BattleActor extends Window_BattleStatus {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_BattleStatus.prototype.initialize.call(this, rect);
        this.openness = 255;
        this.hide();
    }
    ;
    show() {
        this.forceSelect(0);
        window.$gameTemp.clearTouchState();
        Window_BattleStatus.prototype.show.call(this);
    }
    ;
    hide() {
        Window_BattleStatus.prototype.hide.call(this);
        window.$gameParty.select(null);
    }
    ;
    select(index) {
        Window_BattleStatus.prototype.select.call(this, index);
        window.$gameParty.select(this.actor(index));
    }
    ;
    processTouch() {
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
    }
    ;
}
