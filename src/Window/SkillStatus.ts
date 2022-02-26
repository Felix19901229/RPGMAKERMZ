import { Rectangle } from "../Core/index.js";
import { Game_Actor } from "../Game/index.js";
import { Window_StatusBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_SkillStatus
 * 
 * The window for displaying the skill user's status on the skill screen.
*/
export class Window_SkillStatus extends Window_StatusBase{
    _actor: Game_Actor;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
    };

    public setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    public refresh() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._actor) {
            const x = this.colSpacing() / 2;
            const h = this.innerHeight;
            const y = h / 2 - this.lineHeight() * 1.5;
            this.drawActorFace(this._actor, x + 1, 0, 144, h);
            this.drawActorSimpleStatus(this._actor, x + 180, y);
        }
    };
}
