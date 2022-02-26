import { Game_Actor } from "../Game/index.js";
import { Rectangle } from "../Core/index.js";
import { Window_Command } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_SkillType
 * 
 * The window for selecting a skill type on the skill screen.
*/
export class Window_SkillType extends Window_Command {
    _actor: Nullable<Game_Actor>;
    _skillWindow: any;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this._actor = null;
    };

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    };

    public makeCommandList() {
        if (this._actor) {
            const skillTypes = this._actor.skillTypes();
            for (const stypeId of skillTypes) {
                const name = window.$dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill", true, stypeId);
            }
        }
    };

    public update() {
        Window_Command.prototype.update.call(this);
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
        }
    };

    public setSkillWindow(skillWindow) {
        this._skillWindow = skillWindow;
    };

    public selectLast() {
        const skill = this._actor.lastMenuSkill();
        if (skill) {
            this.selectExt((skill as Skill).stypeId);
        } else {
            this.forceSelect(0);
        }
    };
}
