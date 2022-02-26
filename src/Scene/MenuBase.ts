import { Graphics, Sprite, Rectangle } from "../Core/index.js";
import { SceneManager, ConfigManager, SoundManager } from "../Manager/index.js";
import { Sprite_Button } from "../Spriteset/index.js";
import { Window_Help } from "../Window/index.js";
import { Scene_Base } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_MenuBase
 * 
 * The superclass of all the menu-type scenes.
*/
export class Scene_MenuBase extends Scene_Base {
    _actor: any;
    _backgroundFilter: import("pixi.js").filters.BlurFilter;
    _backgroundSprite: Sprite;
    _helpWindow: Window_Help;
    _cancelButton: Sprite_Button;
    _pageupButton: Sprite_Button;
    _pagedownButton: Sprite_Button;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_Base.prototype.initialize.call(this);
    };

    public create() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.updateActor();
        this.createWindowLayer();
        this.createButtons();
    };

    public update() {
        Scene_Base.prototype.update.call(this);
        this.updatePageButtons();
    };

    public helpAreaTop() {
        if (this.isBottomHelpMode()) {
            return this.mainAreaBottom();
        } else if (this.isBottomButtonMode()) {
            return 0;
        } else {
            return this.buttonAreaBottom();
        }
    };

    public helpAreaBottom() {
        return this.helpAreaTop() + this.helpAreaHeight();
    };

    public helpAreaHeight() {
        return this.calcWindowHeight(2, false);
    };

    public mainAreaTop() {
        if (!this.isBottomHelpMode()) {
            return this.helpAreaBottom();
        } else if (this.isBottomButtonMode()) {
            return 0;
        } else {
            return this.buttonAreaBottom();
        }
    };

    public mainAreaBottom() {
        return this.mainAreaTop() + this.mainAreaHeight();
    };

    public mainAreaHeight() {
        return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight();
    };

    public actor() {
        return this._actor;
    };

    public updateActor() {
        this._actor = window.$gameParty.menuActor();
    };

    public createBackground() {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);
    };

    public setBackgroundOpacity(opacity) {
        this._backgroundSprite.opacity = opacity;
    };

    public createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    };

    public helpWindowRect() {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    public createButtons() {
        if (ConfigManager.touchUI) {
            if (this.needsCancelButton()) {
                this.createCancelButton();
            }
            if (this.needsPageButtons()) {
                this.createPageButtons();
            }
        }
    };

    public needsCancelButton() {
        return true;
    };

    public createCancelButton() {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    };

    public needsPageButtons() {
        return false;
    };

    public createPageButtons() {
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
    };

    public updatePageButtons() {
        if (this._pageupButton && this._pagedownButton) {
            const enabled = this.arePageButtonsEnabled();
            this._pageupButton.visible = enabled;
            this._pagedownButton.visible = enabled;
        }
    };

    public arePageButtonsEnabled() {
        return true;
    };

    public nextActor() {
        window.$gameParty.makeMenuActorNext();
        this.updateActor();
        this.onActorChange();
    };

    public previousActor() {
        window.$gameParty.makeMenuActorPrevious();
        this.updateActor();
        this.onActorChange();
    };

    public onActorChange() {
        SoundManager.playCursor();
    };
}