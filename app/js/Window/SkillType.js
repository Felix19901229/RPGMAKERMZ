import { Window_Command } from "./index.js";
export class Window_SkillType extends Window_Command {
    _actor;
    _skillWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this._actor = null;
    }
    ;
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    }
    ;
    makeCommandList() {
        if (this._actor) {
            const skillTypes = this._actor.skillTypes();
            for (const stypeId of skillTypes) {
                const name = window.$dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill", true, stypeId);
            }
        }
    }
    ;
    update() {
        Window_Command.prototype.update.call(this);
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
        }
    }
    ;
    setSkillWindow(skillWindow) {
        this._skillWindow = skillWindow;
    }
    ;
    selectLast() {
        const skill = this._actor.lastMenuSkill();
        if (skill) {
            this.selectExt(skill.stypeId);
        }
        else {
            this.forceSelect(0);
        }
    }
    ;
}
