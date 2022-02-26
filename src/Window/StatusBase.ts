import { Sprite_Gauge, Sprite_Name, Sprite_StateIcon } from "../Spriteset/index.js";
import { Rectangle } from "../Core/index.js";
import { BattleManager, ColorManager, ImageManager, TextManager } from "../Manager/index.js";
import { Window_Selectable } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_StatusBase
 * 
 * The superclass of windows for displaying actor status.
*/
export class Window_StatusBase extends Window_Selectable {
    _additionalSprites: { [key: string]: Sprite_Gauge | Sprite_Name | Sprite_StateIcon };
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args)
    }
    public initialize(rect: Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._additionalSprites = {};
        this.loadFaceImages();
    };
    public loadFaceImages() {
        for (const actor of window.$gameParty.members()) {
            ImageManager.loadFace(actor.faceName());
        }
    };
    public refresh() {
        this.hideAdditionalSprites();
        Window_Selectable.prototype.refresh.call(this);
    };
    public hideAdditionalSprites() {
        for (const sprite of Object.values(this._additionalSprites)) {
            sprite.hide();
        }
    };
    public placeActorName(actor, x, y) {
        const key = "actor%1-name".format(actor.actorId());
        const sprite = this.createInnerSprite(key, Sprite_Name);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    };
    public placeStateIcon(actor, x, y) {
        const key = "actor%1-stateIcon".format(actor.actorId());
        const sprite = this.createInnerSprite(key, Sprite_StateIcon);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    };
    public placeGauge(actor, type, x, y) {
        const key = "actor%1-gauge-%2".format(actor.actorId(), type);
        const sprite = this.createInnerSprite(key, Sprite_Gauge);
        sprite.setup(actor, type);
        sprite.move(x, y);
        sprite.show();
    };
    public createInnerSprite(key, spriteClass) {
        const dict = this._additionalSprites;
        if (dict[key]) {
            return dict[key];
        } else {
            const sprite = new spriteClass();
            dict[key] = sprite;
            this.addInnerChild(sprite);
            return sprite;
        }
    };
    public placeTimeGauge(actor, x, y) {
        if (BattleManager.isTpb()) {
            this.placeGauge(actor, "time", x, y);
        }
    };
    public placeBasicGauges(actor, x, y) {
        this.placeGauge(actor, "hp", x, y);
        this.placeGauge(actor, "mp", x, y + this.gaugeLineHeight());
        if (window.$dataSystem.optDisplayTp) {
            this.placeGauge(actor, "tp", x, y + this.gaugeLineHeight() * 2);
        }
    };
    public gaugeLineHeight() {
        return 24;
    };
    public drawActorCharacter(actor, x, y) {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    };

    public drawActorFace(actor, x, y, width?, height?) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    };
    public drawActorName(actor, x, y, width = 168) {
        width = width;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    };
    public drawActorClass(actor, x, y, width = 168) {
        width = width;
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    };
    public drawActorNickname(actor, x, y, width) {
        width = width || 270;
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    };
    public drawActorLevel(actor, x, y) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 84, y, 36, "right");
    };
    public drawActorIcons(actor, x, y, width = 144) {
        width = width;
        const iconWidth = ImageManager.iconWidth;
        const icons = actor.allIcons().slice(0, Math.floor(width / iconWidth));
        let iconX = x;
        for (const icon of icons) {
            this.drawIcon(icon, iconX, y + 2);
            iconX += iconWidth;
        }
    };
    public drawActorSimpleStatus(actor, x, y) {
        const lineHeight = this.lineHeight();
        const x2 = x + 180;
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.placeBasicGauges(actor, x2, y + lineHeight);
    };
    public actorSlotName(actor, index) {
        const slots = actor.equipSlots();
        return window.$dataSystem.equipTypes[slots[index]];
    };

}
