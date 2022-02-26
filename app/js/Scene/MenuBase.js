import { Graphics, Sprite, Rectangle } from "../Core/index.js";
import { SceneManager, ConfigManager, SoundManager } from "../Manager/index.js";
import { Sprite_Button } from "../Spriteset/index.js";
import { Window_Help } from "../Window/index.js";
import { Scene_Base } from "./index.js";
export class Scene_MenuBase extends Scene_Base {
    _actor;
    _backgroundFilter;
    _backgroundSprite;
    _helpWindow;
    _cancelButton;
    _pageupButton;
    _pagedownButton;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(...args) {
        Scene_Base.prototype.initialize.call(this);
    }
    ;
    create() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.updateActor();
        this.createWindowLayer();
        this.createButtons();
    }
    ;
    update() {
        Scene_Base.prototype.update.call(this);
        this.updatePageButtons();
    }
    ;
    helpAreaTop() {
        if (this.isBottomHelpMode()) {
            return this.mainAreaBottom();
        }
        else if (this.isBottomButtonMode()) {
            return 0;
        }
        else {
            return this.buttonAreaBottom();
        }
    }
    ;
    helpAreaBottom() {
        return this.helpAreaTop() + this.helpAreaHeight();
    }
    ;
    helpAreaHeight() {
        return this.calcWindowHeight(2, false);
    }
    ;
    mainAreaTop() {
        if (!this.isBottomHelpMode()) {
            return this.helpAreaBottom();
        }
        else if (this.isBottomButtonMode()) {
            return 0;
        }
        else {
            return this.buttonAreaBottom();
        }
    }
    ;
    mainAreaBottom() {
        return this.mainAreaTop() + this.mainAreaHeight();
    }
    ;
    mainAreaHeight() {
        return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight();
    }
    ;
    actor() {
        return this._actor;
    }
    ;
    updateActor() {
        this._actor = window.$gameParty.menuActor();
    }
    ;
    createBackground() {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);
    }
    ;
    setBackgroundOpacity(opacity) {
        this._backgroundSprite.opacity = opacity;
    }
    ;
    createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    }
    ;
    helpWindowRect() {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    createButtons() {
        if (ConfigManager.touchUI) {
            if (this.needsCancelButton()) {
                this.createCancelButton();
            }
            if (this.needsPageButtons()) {
                this.createPageButtons();
            }
        }
    }
    ;
    needsCancelButton() {
        return true;
    }
    ;
    createCancelButton() {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    }
    ;
    needsPageButtons() {
        return false;
    }
    ;
    createPageButtons() {
        this._pageupButton = new Sprite_Button("pageup");
        this._pageupButton.x = 4;
        this._pageupButton.y = this.buttonY();
        const pageupRight = this._pageupButton.x + this._pageupButton.width;
        this._pagedownButton = new Sprite_Button("pagedown");
        this._pagedownButton.x = pageupRight + 4;
        this._pagedownButton.y = this.buttonY();
        this.addWindow(this._pageupButton);
        this.addWindow(this._pagedownButton);
        this._pageupButton.setClickHandler(this.previousActor.bind(this));
        this._pagedownButton.setClickHandler(this.nextActor.bind(this));
    }
    ;
    updatePageButtons() {
        if (this._pageupButton && this._pagedownButton) {
            const enabled = this.arePageButtonsEnabled();
            this._pageupButton.visible = enabled;
            this._pagedownButton.visible = enabled;
        }
    }
    ;
    arePageButtonsEnabled() {
        return true;
    }
    ;
    nextActor() {
        window.$gameParty.makeMenuActorNext();
        this.updateActor();
        this.onActorChange();
    }
    ;
    previousActor() {
        window.$gameParty.makeMenuActorPrevious();
        this.updateActor();
        this.onActorChange();
    }
    ;
    onActorChange() {
        SoundManager.playCursor();
    }
    ;
}
