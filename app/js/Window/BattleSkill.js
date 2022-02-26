import { Window_SkillList } from "./index.js";
export class Window_BattleSkill extends Window_SkillList {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_SkillList.prototype.initialize.call(this, rect);
        this.hide();
    }
    ;
    show() {
        this.selectLast();
        this.showHelpWindow();
        Window_SkillList.prototype.show.call(this);
    }
    ;
    hide() {
        this.hideHelpWindow();
        Window_SkillList.prototype.hide.call(this);
    }
    ;
}
