import { Input, TouchInput,Sprite } from "../Core/index.js";
import { AudioManager, ImageManager, SceneManager } from "../Manager/index.js";
import { Scene_Base ,Scene_Title} from "./index.js";

//-----------------------------------------------------------------------------


/**
 * Scene_Gameover
 * 
 * The scene class of the game over screen.
*/
export class Scene_Gameover extends Scene_Base {
    _backSprite: Sprite;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_Base.prototype.initialize.call(this);
    };

    public create() {
        Scene_Base.prototype.create.call(this);
        this.playGameoverMusic();
        this.createBackground();
    };

    public start() {
        Scene_Base.prototype.start.call(this);
        this.adjustBackground();
        this.startFadeIn(this.slowFadeSpeed(), false);
    };

    public update() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.gotoTitle();
        }
        Scene_Base.prototype.update.call(this);
    };

    public stop() {
        Scene_Base.prototype.stop.call(this);
        this.fadeOutAll();
    };

    public terminate() {
        Scene_Base.prototype.terminate.call(this);
        AudioManager.stopAll();
    };

    public playGameoverMusic() {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.playMe(window.$dataSystem.gameoverMe);
    };

    public createBackground() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem("GameOver");
        this.addChild(this._backSprite);
    };

    public adjustBackground() {
        this.scaleSprite(this._backSprite);
        this.centerSprite(this._backSprite);
    };

    public isTriggered() {
        return Input.isTriggered("ok") || TouchInput.isTriggered();
    };

    public gotoTitle() {
        SceneManager.goto(Scene_Title);
    };
}
