import { TextManager, ConfigManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
export class Window_ActorCommand extends Window_Command {
    _actor;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.deactivate();
        this._actor = null;
    }
    ;
    makeCommandList() {
        if (this._actor) {
            this.addAttackCommand();
            this.addSkillCommands();
            this.addGuardCommand();
            this.addItemCommand();
        }
    }
    ;
    addAttackCommand() {
        this.addCommand(TextManager.attack, "attack", this._actor.canAttack());
    }
    ;
    addSkillCommands() {
        const skillTypes = this._actor.skillTypes();
        for (const stypeId of skillTypes) {
            const name = window.$dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }
    }
    ;
    addGuardCommand() {
        this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
    }
    ;
    addItemCommand() {
        this.addCommand(TextManager.item, "item");
    }
    ;
    setup(actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    }
    ;
    actor() {
        return this._actor;
    }
    ;
    processOk() {
        if (this._actor) {
            if (ConfigManager.commandRemember) {
                this._actor.setLastCommandSymbol(this.currentSymbol());
            }
            else {
                this._actor.setLastCommandSymbol("");
            }
        }
        Window_Command.prototype.processOk.call(this);
    }
    ;
    selectLast() {
        this.forceSelect(0);
        if (this._actor && ConfigManager.commandRemember) {
            const symbol = this._actor.lastCommandSymbol();
            this.selectSymbol(symbol);
            if (symbol === "skill") {
                const skill = this._actor.lastBattleSkill();
                if (skill) {
                    this.selectExt(skill.stypeId);
                }
            }
        }
    }
    ;
}
