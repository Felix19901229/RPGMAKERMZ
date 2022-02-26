import { Game_Actor } from "../Game/index.js";
import { Rectangle } from "../Core/index.js";
import { ColorManager, TextManager, ImageManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_EquipStatus
 * 
 * The window for displaying parameter changes on the equipment screen.
*/
export class Window_EquipStatus extends Window_StatusBase {
    _actor: Game_Actor;
    _tempActor: Game_Actor;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
        this._tempActor = null;
        this.refresh();
    };

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    public colSpacing() {
        return 0;
    };

    public refresh() {
        this.contents.clear();
        if (this._actor) {
            const nameRect = this.itemLineRect(0);
            this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);
            this.drawActorFace(this._actor, nameRect.x, 0, nameRect.height);
            this.drawAllParams();
        }
    };

    public setTempActor(tempActor) {
        if (this._tempActor !== tempActor) {
            this._tempActor = tempActor;
            this.refresh();
        }
    };

    public drawAllParams() {
        for (let i = 0; i < 6; i++) {
            const x = this.itemPadding();
            const y = this.paramY(i);
            this.drawItem(x, y, 2 + i);
        }
    };

    public drawItem(x, y, paramId) {
        const paramX = this.paramX();
        const paramWidth = this.paramWidth();
        const rightArrowWidth = this.rightArrowWidth();
        this.drawParamName(x, y, paramId);
        if (this._actor) {
            this.drawCurrentParam(paramX, y, paramId);
        }
        this.drawRightArrow(paramX + paramWidth, y);
        if (this._tempActor) {
            this.drawNewParam(paramX + paramWidth + rightArrowWidth, y, paramId);
        }
    };

    public drawParamName(x, y, paramId) {
        const width = this.paramX() - this.itemPadding() * 2;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.param(paramId), x, y, width);
    };

    public drawCurrentParam(x, y, paramId) {
        const paramWidth = this.paramWidth();
        this.resetTextColor();
        this.drawText(this._actor.param(paramId), x, y, paramWidth, "right");
    };

    public drawRightArrow(x, y) {
        const rightArrowWidth = this.rightArrowWidth();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("\u2192", x, y, rightArrowWidth, "center");
    };

    public drawNewParam(x, y, paramId) {
        const paramWidth = this.paramWidth();
        const newValue = this._tempActor.param(paramId);
        const diffvalue = newValue - this._actor.param(paramId);
        this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
        this.drawText(newValue, x, y, paramWidth, "right");
    };

    public rightArrowWidth() {
        return 32;
    };

    public paramWidth() {
        return 48;
    };

    public paramX() {
        const itemPadding = this.itemPadding();
        const rightArrowWidth = this.rightArrowWidth();
        const paramWidth = this.paramWidth();
        return this.innerWidth - itemPadding - paramWidth * 2 - rightArrowWidth;
    };

    public paramY(index) {
        const faceHeight = ImageManager.faceHeight;
        return faceHeight + Math.floor(this.lineHeight() * (index + 1.5));
    };
}
