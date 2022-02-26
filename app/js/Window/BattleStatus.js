import { ImageManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";
export class Window_BattleStatus extends Window_StatusBase {
    _bitmapsReady;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this.frameVisible = false;
        this.openness = 0;
        this._bitmapsReady = 0;
        this.preparePartyRefresh();
    }
    ;
    extraHeight() {
        return 10;
    }
    ;
    maxCols() {
        return 4;
    }
    ;
    itemHeight() {
        return this.innerHeight;
    }
    ;
    maxItems() {
        return window.$gameParty.battleMembers().length;
    }
    ;
    rowSpacing() {
        return 0;
    }
    ;
    updatePadding() {
        this.padding = 8;
    }
    ;
    actor(index) {
        return window.$gameParty.battleMembers()[index];
    }
    ;
    selectActor(actor) {
        const members = window.$gameParty.battleMembers();
        this.select(members.indexOf(actor));
    }
    ;
    update() {
        Window_StatusBase.prototype.update.call(this);
        if (window.$gameTemp.isBattleRefreshRequested()) {
            this.preparePartyRefresh();
        }
    }
    ;
    preparePartyRefresh() {
        window.$gameTemp.clearBattleRefreshRequest();
        this._bitmapsReady = 0;
        for (const actor of window.$gameParty.members()) {
            const bitmap = ImageManager.loadFace(actor.faceName());
            bitmap.addLoadListener(this.performPartyRefresh.bind(this));
        }
    }
    ;
    performPartyRefresh() {
        this._bitmapsReady++;
        if (this._bitmapsReady >= window.$gameParty.members().length) {
            this.refresh();
        }
    }
    ;
    drawItem(index) {
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }
    ;
    drawItemImage(index) {
        const actor = this.actor(index);
        const rect = this.faceRect(index);
        this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
    }
    ;
    drawItemStatus(index) {
        const actor = this.actor(index);
        const rect = this.itemRectWithPadding(index);
        const nameX = this.nameX(rect);
        const nameY = this.nameY(rect);
        const stateIconX = this.stateIconX(rect);
        const stateIconY = this.stateIconY(rect);
        const basicGaugesX = this.basicGaugesX(rect);
        const basicGaugesY = this.basicGaugesY(rect);
        this.placeTimeGauge(actor, nameX, nameY);
        this.placeActorName(actor, nameX, nameY);
        this.placeStateIcon(actor, stateIconX, stateIconY);
        this.placeBasicGauges(actor, basicGaugesX, basicGaugesY);
    }
    ;
    faceRect(index) {
        const rect = this.itemRect(index);
        rect.pad(-1);
        rect.height = this.nameY(rect) + this.gaugeLineHeight() / 2 - rect.y;
        return rect;
    }
    ;
    nameX(rect) {
        return rect.x;
    }
    ;
    nameY(rect) {
        return this.basicGaugesY(rect) - this.gaugeLineHeight();
    }
    ;
    stateIconX(rect) {
        return rect.x + rect.width - ImageManager.iconWidth / 2 + 4;
    }
    ;
    stateIconY(rect) {
        return rect.y + ImageManager.iconHeight / 2 + 4;
    }
    ;
    basicGaugesX(rect) {
        return rect.x;
    }
    ;
    basicGaugesY(rect) {
        const bottom = rect.y + rect.height - this.extraHeight();
        const numGauges = window.$dataSystem.optDisplayTp ? 3 : 2;
        return bottom - this.gaugeLineHeight() * numGauges;
    }
    ;
}
