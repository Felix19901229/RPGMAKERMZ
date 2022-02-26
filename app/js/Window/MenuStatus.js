import { ColorManager, ImageManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
export class Window_MenuStatus extends Window_StatusBase {
    _formationMode;
    _pendingIndex;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._formationMode = false;
        this._pendingIndex = -1;
        this.refresh();
    }
    ;
    maxItems() {
        return window.$gameParty.size();
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    itemHeight() {
        return Math.floor(this.innerHeight / this.numVisibleRows());
    }
    ;
    actor(index) {
        return window.$gameParty.members()[index];
    }
    ;
    drawItem(index) {
        this.drawPendingItemBackground(index);
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }
    ;
    drawPendingItemBackground(index) {
        if (index === this._pendingIndex) {
            const rect = this.itemRect(index);
            const color = ColorManager.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    }
    ;
    drawItemImage(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const width = ImageManager.faceWidth;
        const height = rect.height - 2;
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
        this.changePaintOpacity(true);
    }
    ;
    drawItemStatus(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x + 180;
        const y = rect.y + Math.floor(rect.height / 2 - this.lineHeight() * 1.5);
        this.drawActorSimpleStatus(actor, x, y);
    }
    ;
    processOk() {
        Window_StatusBase.prototype.processOk.call(this);
        const actor = this.actor(this.index());
        window.$gameParty.setMenuActor(actor);
    }
    ;
    isCurrentItemEnabled() {
        if (this._formationMode) {
            const actor = this.actor(this.index());
            return actor && actor.isFormationChangeOk();
        }
        else {
            return true;
        }
    }
    ;
    selectLast() {
        this.smoothSelect(window.$gameParty.menuActor().index() || 0);
    }
    ;
    formationMode() {
        return this._formationMode;
    }
    ;
    setFormationMode(formationMode) {
        this._formationMode = formationMode;
    }
    ;
    pendingIndex() {
        return this._pendingIndex;
    }
    ;
    setPendingIndex(index) {
        const lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
    }
    ;
}
