import { Bitmap, Sprite, Graphics, Rectangle } from "../Core/index.js";
import { SceneManager, ImageManager, DataManager, AudioManager } from "../Manager/index.js";
import { Window_TitleCommand } from "../Window/index.js";
import { Scene_Base, Scene_Load, Scene_Map, Scene_Options } from "./index.js";
export class Scene_Title extends Scene_Base {
    _commandWindow;
    _gameTitleSprite;
    _backSprite1;
    _backSprite2;
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
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
    }
    ;
    start() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        this.adjustBackground();
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    }
    ;
    update() {
        if (!this.isBusy()) {
            this._commandWindow.open();
        }
        Scene_Base.prototype.update.call(this);
    }
    ;
    isBusy() {
        return (this._commandWindow.isClosing() ||
            Scene_Base.prototype.isBusy.call(this));
    }
    ;
    terminate() {
        Scene_Base.prototype.terminate.call(this);
        SceneManager.snapForBackground();
        if (this._gameTitleSprite) {
            this._gameTitleSprite.bitmap.destroy();
        }
    }
    ;
    createBackground() {
        this._backSprite1 = new Sprite(ImageManager.loadTitle1(window.$dataSystem.title1Name));
        this._backSprite2 = new Sprite(ImageManager.loadTitle2(window.$dataSystem.title2Name));
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    }
    ;
    createForeground() {
        this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._gameTitleSprite);
        if (window.$dataSystem.optDrawTitle) {
            this.drawGameTitle();
        }
    }
    ;
    drawGameTitle() {
        const x = 20;
        const y = Graphics.height / 4;
        const maxWidth = Graphics.width - x * 2;
        const text = window.$dataSystem.gameTitle;
        const bitmap = this._gameTitleSprite.bitmap;
        bitmap.fontFace = window.$gameSystem.mainFontFace();
        bitmap.outlineColor = "black";
        bitmap.outlineWidth = 8;
        bitmap.fontSize = 72;
        bitmap.drawText(text, x, y, maxWidth, 48, "center");
    }
    ;
    adjustBackground() {
        this.scaleSprite(this._backSprite1);
        this.scaleSprite(this._backSprite2);
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
    }
    ;
    createCommandWindow() {
        const background = window.$dataSystem.titleCommandWindow.background;
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_TitleCommand(rect);
        this._commandWindow.setBackgroundType(background);
        this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
        this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
        this._commandWindow.setHandler("options", this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    }
    ;
    commandWindowRect() {
        const offsetX = window.$dataSystem.titleCommandWindow.offsetX;
        const offsetY = window.$dataSystem.titleCommandWindow.offsetY;
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
        const wy = Graphics.boxHeight - wh - 96 + offsetY;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    commandNewGame() {
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    }
    ;
    commandContinue() {
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    }
    ;
    commandOptions() {
        this._commandWindow.close();
        SceneManager.push(Scene_Options);
    }
    ;
    playTitleMusic() {
        AudioManager.playBgm(window.$dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    }
    ;
}
