import { AudioManager, DataManager, EffectManager, FontManager, ImageManager, SceneManager } from "../Manager/index.js";
import { ColorFilter, Graphics, Stage, WindowLayer } from "../Core/index.js";
import { Window_Base } from "../Windows/index.js";
//-----------------------------------------------------------------------------
/**
 * Scene_Base
 * 
 * The superclass of all scenes within the game.
*/
export class Scene_Base extends Stage {
    _started: boolean;
    _fadeSign: number;
    _active: boolean;
    _fadeDuration: number;
    _fadeOpacity: number;
    _fadeWhite: number;
    _windowLayer: WindowLayer;
    _colorFilter: ColorFilter;
    constructor() {
        super();
        this.initialize();
    }
    public initialize() {
        Stage.prototype.initialize.call(this);
        this._started = false;
        this._active = false;
        this._fadeSign = 0;
        this._fadeDuration = 0;
        this._fadeWhite = 0;
        this._fadeOpacity = 0;
        this.createColorFilter();
    };

    public create() {
        //
    };

    public isActive() {
        return this._active;
    };

    public isReady() {
        return (
            ImageManager.isReady() &&
            EffectManager.isReady() &&
            FontManager.isReady()
        );
    };

    public start() {
        this._started = true;
        this._active = true;
    };

    public update() {
        this.updateFade();
        this.updateColorFilter();
        this.updateChildren();
        AudioManager.checkErrors();
    };

    public stop() {
        this._active = false;
    };

    public isStarted() {
        return this._started;
    };

    public isBusy() {
        return this.isFading();
    };

    public isFading() {
        return this._fadeDuration > 0;
    };

    public terminate() {
        //
    };

    public createWindowLayer() {
        this._windowLayer = new WindowLayer();
        this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._windowLayer);
    };

    public addWindow(window) {
        this._windowLayer.addChild(window);
    };

    public startFadeIn(duration: number, white: number) {
        this._fadeSign = 1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white;
        this._fadeOpacity = 255;
        this.updateColorFilter();
    };

    public startFadeOut(duration: number, white?: number) {
        this._fadeSign = -1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white;
        this._fadeOpacity = 0;
        this.updateColorFilter();
    };

    public createColorFilter() {
        this._colorFilter = new ColorFilter();
        this.filters = [this._colorFilter];
    };

    public updateColorFilter() {
        const c = this._fadeWhite ? 255 : 0;
        const blendColor: [number, number, number, number] = [c, c, c, this._fadeOpacity];
        this._colorFilter.setBlendColor(blendColor);
    };

    public updateFade() {
        if (this._fadeDuration > 0) {
            const d = this._fadeDuration;
            if (this._fadeSign > 0) {
                this._fadeOpacity -= this._fadeOpacity / d;
            } else {
                this._fadeOpacity += (255 - this._fadeOpacity) / d;
            }
            this._fadeDuration--;
        }
    };

    public updateChildren() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    };

    public popScene() {
        SceneManager.pop();
    };

    public checkGameover() {
        if ($gameParty.isAllDead()) {
            SceneManager.goto(Scene_Gameover);
        }
    };

    public fadeOutAll() {
        const time = this.slowFadeSpeed() / 60;
        AudioManager.fadeOutBgm(time);
        AudioManager.fadeOutBgs(time);
        AudioManager.fadeOutMe(time);
        this.startFadeOut(this.slowFadeSpeed());
    };

    public fadeSpeed() {
        return 24;
    };

    public slowFadeSpeed() {
        return this.fadeSpeed() * 2;
    };

    public scaleSprite(sprite) {
        const ratioX = Graphics.width / sprite.bitmap.width;
        const ratioY = Graphics.height / sprite.bitmap.height;
        const scale = Math.max(ratioX, ratioY, 1.0);
        sprite.scale.x = scale;
        sprite.scale.y = scale;
    };

    public centerSprite(sprite) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    };

    public isBottomHelpMode() {
        return true;
    };

    public isBottomButtonMode() {
        return false;
    };

    public isRightInputMode() {
        return true;
    };

    public mainCommandWidth() {
        return 240;
    };

    public buttonAreaTop() {
        if (this.isBottomButtonMode()) {
            return Graphics.boxHeight - this.buttonAreaHeight();
        } else {
            return 0;
        }
    };

    public buttonAreaBottom() {
        return this.buttonAreaTop() + this.buttonAreaHeight();
    };

    public buttonAreaHeight() {
        return 52;
    };

    public buttonY() {
        const offsetY = Math.floor((this.buttonAreaHeight() - 48) / 2);
        return this.buttonAreaTop() + offsetY;
    };

    public calcWindowHeight(numLines, selectable) {
        if (selectable) {
            return Window_Selectable.prototype.fittingHeight(numLines);
        } else {
            return Window_Base.prototype.fittingHeight(numLines);
        }
    };

    public requestAutosave() {
        if (this.isAutosaveEnabled()) {
            this.executeAutosave();
        }
    };

    public isAutosaveEnabled() {
        return (
            !DataManager.isBattleTest() &&
            !DataManager.isEventTest() &&
            $gameSystem.isAutosaveEnabled() &&
            $gameSystem.isSaveEnabled()
        );
    };

    public executeAutosave() {
        $gameSystem.onBeforeSave();
        DataManager.saveGame(0)
            .then(() => this.onAutosaveSuccess())
            .catch(() => this.onAutosaveFailure());
    };

    public onAutosaveSuccess() {
        //
    };

    public onAutosaveFailure() {
        //
    };

}

function Scene_Gameover(Scene_Gameover: any) {
    throw new Error("Function not implemented.");
}

