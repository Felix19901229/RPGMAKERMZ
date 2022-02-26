import { Game_Actor } from "../Game/index.js";
import { Rectangle } from "../Core/index.js";
import { TextManager, ConfigManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";

//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.

export class Window_ActorCommand extends Window_Command {
    _actor: Game_Actor;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect:Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.deactivate();
        this._actor = null;
    };

    public makeCommandList() {
        if (this._actor) {
            this.addAttackCommand();
            this.addSkillCommands();
            this.addGuardCommand();
            this.addItemCommand();
        }
    };

    public addAttackCommand() {
        this.addCommand(TextManager.attack, "attack", this._actor.canAttack());
    };

    public addSkillCommands() {
        const skillTypes = this._actor.skillTypes();
        for (const stypeId of skillTypes) {
            const name = window.$dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }
    };

    public addGuardCommand() {
        this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
    };

    public addItemCommand() {
        this.addCommand(TextManager.item, "item");
    };

    public setup(actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    };

    public actor() {
        return this._actor;
    };

    public processOk() {
        if (this._actor) {
            if (ConfigManager.commandRemember) {
                this._actor.setLastCommandSymbol(this.currentSymbol());
            } else {
                this._actor.setLastCommandSymbol("");
            }
        }
        Window_Command.prototype.processOk.call(this);
    };

    public selectLast() {
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
    };
}
