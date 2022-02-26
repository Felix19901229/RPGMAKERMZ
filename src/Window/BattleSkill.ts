import { Rectangle } from "../Core/index.js";
import { Window_SkillList } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_BattleSkill
 * 
 * The window for selecting a skill to use on the battle screen.
*/
export class Window_BattleSkill extends Window_SkillList {
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_SkillList.prototype.initialize.call(this, rect);
        this.hide();
    };

    public show() {
        this.selectLast();
        this.showHelpWindow();
        Window_SkillList.prototype.show.call(this);
    };

    public hide() {
        this.hideHelpWindow();
        Window_SkillList.prototype.hide.call(this);
    };


}
