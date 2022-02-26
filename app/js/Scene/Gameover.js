import { Input, TouchInput, Sprite } from "../Core/index.js";
import { AudioManager, ImageManager, SceneManager } from "../Manager/index.js";
import { Scene_Base, Scene_Title } from "./index.js";
export class Scene_Gameover extends Scene_Base {
    _backSprite;
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
        this.playGameoverMusic();
        this.createBackground();
    }
    ;
    start() {
        Scene_Base.prototype.start.call(this);
        this.adjustBackground();
        this.startFadeIn(this.slowFadeSpeed(), false);
    }
    ;
    update() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.gotoTitle();
        }
        Scene_Base.prototype.update.call(this);
    }
    ;
    stop() {
        Scene_Base.prototype.stop.call(this);
        this.fadeOutAll();
    }
    ;
    terminate() {
        Scene_Base.prototype.terminate.call(this);
        AudioManager.stopAll();
    }
    ;
    playGameoverMusic() {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.playMe(window.$dataSystem.gameoverMe);
    }
    ;
    createBackground() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem("GameOver");
        this.addChild(this._backSprite);
    }
    ;
    adjustBackground() {
        this.scaleSprite(this._backSprite);
        this.centerSprite(this._backSprite);
    }
    ;
    isTriggered() {
        return Input.isTriggered("ok") || TouchInput.isTriggered();
    }
    ;
    gotoTitle() {
        SceneManager.goto(Scene_Title);
    }
    ;
}
