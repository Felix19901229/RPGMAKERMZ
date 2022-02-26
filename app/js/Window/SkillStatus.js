import { Window_StatusBase } from "./index.js";
export class Window_SkillStatus extends Window_StatusBase {
    _actor;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
    }
    ;
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }
    ;
    refresh() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._actor) {
            const x = this.colSpacing() / 2;
            const h = this.innerHeight;
            const y = h / 2 - this.lineHeight() * 1.5;
            this.drawActorFace(this._actor, x + 1, 0, 144, h);
            this.drawActorSimpleStatus(this._actor, x + 180, y);
        }
    }
    ;
}
