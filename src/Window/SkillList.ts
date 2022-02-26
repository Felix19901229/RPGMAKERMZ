import { Rectangle } from "../Core/Rectangle.js";
import { Game_Actor } from "../Game/Actor.js";
import { ColorManager } from "../Manager/index.js";
import { Window_Selectable } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_SkillList
 * The window for selecting a skill on the skill screen.
 * 
*/
export class Window_SkillList extends Window_Selectable {
    _actor: Game_Actor;
    _stypeId: number;
    _data: Skill[];
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._actor = null;
        this._stypeId = 0;
        this._data = [];
    };

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.scrollTo(0, 0);
        }
    };

    public setStypeId(stypeId) {
        if (this._stypeId !== stypeId) {
            this._stypeId = stypeId;
            this.refresh();
            this.scrollTo(0, 0);
        }
    };

    public maxCols() {
        return 2;
    };

    public colSpacing() {
        return 16;
    };

    public maxItems() {
        return this._data ? this._data.length : 1;
    };

    public item() {
        return this.itemAt(this.index());
    };

    public itemAt(index) {
        return this._data && index >= 0 ? this._data[index] : null;
    };

    public isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    };

    public includes(item) {
        return item && item.stypeId === this._stypeId;
    };

    public isEnabled(item) {
        return this._actor && this._actor.canUse(item);
    };

    public makeItemList() {
        if (this._actor) {
            this._data = this._actor.skills().filter(item => this.includes(item));
        } else {
            this._data = [];
        }
    };

    public selectLast() {
        const index = this._data.indexOf(this._actor.lastSkill());
        this.forceSelect(index >= 0 ? index : 0);
    };

    public drawItem(index) {
        const skill = this.itemAt(index);
        if (skill) {
            const costWidth = this.costWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    public costWidth() {
        return this.textWidth("000");
    };

    public drawSkillCost(skill, x, y, width) {
        if (this._actor.skillTpCost(skill) > 0) {
            this.changeTextColor(ColorManager.tpCostColor());
            this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
        } else if (this._actor.skillMpCost(skill) > 0) {
            this.changeTextColor(ColorManager.mpCostColor());
            this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
        }
    };

    public updateHelp() {
        this.setHelpWindowItem(this.item());
    };

    public refresh() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    };
}
