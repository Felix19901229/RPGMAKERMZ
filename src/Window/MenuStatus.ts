import { Rectangle } from "../Core/index.js";
import { ColorManager, ImageManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_MenuStatus
 * 
 * The window for displaying party member status on the menu screen.
*/
export class Window_MenuStatus extends Window_StatusBase {
    _formationMode: boolean;
    _pendingIndex: number;
    constructor(...args: [Rectangle]) {
        super(...args)
        this.initialize(...args);
    }


    public initialize(rect:Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._formationMode = false;
        this._pendingIndex = -1;
        this.refresh();
    };

    public maxItems() {
        return window.$gameParty.size();
    };

    public numVisibleRows() {
        return 4;
    };

    public itemHeight() {
        return Math.floor(this.innerHeight / this.numVisibleRows());
    };

    public actor(index) {
        return window.$gameParty.members()[index];
    };

    public drawItem(index) {
        this.drawPendingItemBackground(index);
        this.drawItemImage(index);
        this.drawItemStatus(index);
    };

    public drawPendingItemBackground(index) {
        if (index === this._pendingIndex) {
            const rect = this.itemRect(index);
            const color = ColorManager.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    };

    public drawItemImage(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const width = ImageManager.faceWidth;
        const height = rect.height - 2;
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
        this.changePaintOpacity(true);
    };

    public drawItemStatus(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x + 180;
        const y = rect.y + Math.floor(rect.height / 2 - this.lineHeight() * 1.5);
        this.drawActorSimpleStatus(actor, x, y);
    };

    public processOk() {
        Window_StatusBase.prototype.processOk.call(this);
        const actor = this.actor(this.index());
        window.$gameParty.setMenuActor(actor);
    };

    public isCurrentItemEnabled() {
        if (this._formationMode) {
            const actor = this.actor(this.index());
            return actor && actor.isFormationChangeOk();
        } else {
            return true;
        }
    };

    public selectLast() {
        this.smoothSelect(window.$gameParty.menuActor().index() || 0);
    };

    public formationMode() {
        return this._formationMode;
    };

    public setFormationMode(formationMode) {
        this._formationMode = formationMode;
    };

    public pendingIndex() {
        return this._pendingIndex;
    };

    public setPendingIndex(index) {
        const lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
    };

}
