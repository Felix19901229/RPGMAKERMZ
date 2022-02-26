import { Rectangle } from "../Core/index.js";
import { Game_Actor } from "../Game/index.js";
import { TextManager, ColorManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_Status
 * 
 * The window for displaying full status on the status screen.
*/
export class Window_Status extends Window_StatusBase {
    _actor: Game_Actor;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
        this.refresh();
        this.activate();
    };

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    public refresh() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._actor) {
            this.drawBlock1();
            this.drawBlock2();
        }
    };

    public drawBlock1() {
        const y = this.block1Y();
        this.drawActorName(this._actor, 6, y, 168);
        this.drawActorClass(this._actor, 192, y, 168);
        this.drawActorNickname(this._actor, 432, y, 270);
    };

    public block1Y() {
        return 0;
    };

    public drawBlock2() {
        const y = this.block2Y();
        this.drawActorFace(this._actor, 12, y);
        this.drawBasicInfo(204, y);
        this.drawExpInfo(456, y);
    };

    public block2Y() {
        const lineHeight = this.lineHeight();
        const min = lineHeight;
        const max = this.innerHeight - lineHeight * 4;
        return Math.floor((lineHeight * 1.4).clamp(min, max));
    };

    public drawBasicInfo(x, y) {
        const lineHeight = this.lineHeight();
        this.drawActorLevel(this._actor, x, y + lineHeight * 0);
        this.drawActorIcons(this._actor, x, y + lineHeight * 1);
        this.placeBasicGauges(this._actor, x, y + lineHeight * 2);
    };

    public drawExpInfo(x, y) {
        const lineHeight = this.lineHeight();
        const expTotal = TextManager.expTotal.format(TextManager.exp);
        const expNext = TextManager.expNext.format(TextManager.level);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(expTotal, x, y + lineHeight * 0, 270);
        this.drawText(expNext, x, y + lineHeight * 2, 270);
        this.resetTextColor();
        this.drawText(this.expTotalValue(), x, y + lineHeight * 1, 270, "right");
        this.drawText(this.expNextValue(), x, y + lineHeight * 3, 270, "right");
    };

    public expTotalValue() {
        if (this._actor.isMaxLevel()) {
            return "-------";
        } else {
            return this._actor.currentExp();
        }
    };

    public expNextValue() {
        if (this._actor.isMaxLevel()) {
            return "-------";
        } else {
            return this._actor.nextRequiredExp();
        }
    };

}
