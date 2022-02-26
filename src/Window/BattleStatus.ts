
import { Rectangle } from "../Core/index.js";
import { ImageManager } from "../Manager/index.js";
import { Window_StatusBase } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_BattleStatus
 * 
 * The window for displaying the status of party members on the battle screen.
*/
export class Window_BattleStatus extends Window_StatusBase {
    _bitmapsReady: number;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this.frameVisible = false;
        this.openness = 0;
        this._bitmapsReady = 0;
        this.preparePartyRefresh();
    };

    public extraHeight() {
        return 10;
    };

    public maxCols() {
        return 4;
    };

    public itemHeight() {
        return this.innerHeight;
    };

    public maxItems() {
        return window.$gameParty.battleMembers().length;
    };

    public rowSpacing() {
        return 0;
    };

    public updatePadding() {
        this.padding = 8;
    };

    public actor(index) {
        return window.$gameParty.battleMembers()[index];
    };

    public selectActor(actor) {
        const members = window.$gameParty.battleMembers();
        this.select(members.indexOf(actor));
    };

    public update() {
        Window_StatusBase.prototype.update.call(this);
        if (window.$gameTemp.isBattleRefreshRequested()) {
            this.preparePartyRefresh();
        }
    };

    public preparePartyRefresh() {
        window.$gameTemp.clearBattleRefreshRequest();
        this._bitmapsReady = 0;
        for (const actor of window.$gameParty.members()) {
            const bitmap = ImageManager.loadFace(actor.faceName());
            bitmap.addLoadListener(this.performPartyRefresh.bind(this));
        }
    };

    public performPartyRefresh() {
        this._bitmapsReady++;
        if (this._bitmapsReady >= window.$gameParty.members().length) {
            this.refresh();
        }
    };

    public drawItem(index) {
        this.drawItemImage(index);
        this.drawItemStatus(index);
    };

    public drawItemImage(index) {
        const actor = this.actor(index);
        const rect = this.faceRect(index);
        this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
    };

    public drawItemStatus(index) {
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
    };

    public faceRect(index) {
        const rect = this.itemRect(index);
        rect.pad(-1);
        rect.height = this.nameY(rect) + this.gaugeLineHeight() / 2 - rect.y;
        return rect;
    };

    public nameX(rect) {
        return rect.x;
    };

    public nameY(rect) {
        return this.basicGaugesY(rect) - this.gaugeLineHeight();
    };

    public stateIconX(rect) {
        return rect.x + rect.width - ImageManager.iconWidth / 2 + 4;
    };

    public stateIconY(rect) {
        return rect.y + ImageManager.iconHeight / 2 + 4;
    };

    public basicGaugesX(rect) {
        return rect.x;
    };

    public basicGaugesY(rect) {
        const bottom = rect.y + rect.height - this.extraHeight();
        const numGauges = window.$dataSystem.optDisplayTp ? 3 : 2;
        return bottom - this.gaugeLineHeight() * numGauges;
    };


}
