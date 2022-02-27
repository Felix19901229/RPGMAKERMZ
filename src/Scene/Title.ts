import { Bitmap, Sprite, Graphics, Rectangle } from "../Core/index.js";
import { SceneManager, ImageManager, DataManager, AudioManager } from "../Manager/index.js";
import { Window_Command, Window_TitleCommand } from "../Window/index.js";
import { Scene_Base,Scene_Load,Scene_Map, Scene_Options } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * 标题画面
 * 
 * 这个类是绘制标题画面
*/
export class Scene_Title extends Scene_Base {
    _commandWindow: Nullable<Window_Command>;
    _gameTitleSprite: Nullable<Sprite>;
    _backSprite1: Nullable<Sprite>;
    _backSprite2: Nullable<Sprite>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_Base.prototype.initialize.call(this);
    };

    /**
     * 创建标题画面
    */
    public create() {
        Scene_Base.prototype.create.call(this);
        //创建图片背景
        this.createBackground();
        //创建文字绘图界面
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
    };

    public start() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        this.adjustBackground();
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    };

    public update() {
        if (!this.isBusy()) {
            this._commandWindow.open();
        }
        Scene_Base.prototype.update.call(this);
    };

    public isBusy() {
        return (
            this._commandWindow.isClosing() ||
            Scene_Base.prototype.isBusy.call(this)
        );
    };

    public terminate() {
        Scene_Base.prototype.terminate.call(this);
        SceneManager.snapForBackground();
        if (this._gameTitleSprite) {
            this._gameTitleSprite.bitmap.destroy();
        }
    };

    /**
     * 创建标题背景画面
    */
    public createBackground() {
        this._backSprite1 = new Sprite(
            ImageManager.loadTitle1(window.$dataSystem.title1Name)
        );
        this._backSprite2 = new Sprite(
            ImageManager.loadTitle2(window.$dataSystem.title2Name)
        );
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    };

    public createForeground() {
        //创建游戏标题文字层
        this._gameTitleSprite = new Sprite(
            new Bitmap(Graphics.width, Graphics.height)
        );
        this.addChild(this._gameTitleSprite);
        if (window.$dataSystem.optDrawTitle) {
            //绘制文字
            this.drawGameTitle();
        }
    };

    /**
     * 绘制标题文字
    */
    public drawGameTitle() {
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
    };

    public adjustBackground() {
        this.scaleSprite(this._backSprite1);
        this.scaleSprite(this._backSprite2);
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
    };

    /**
     * 创建命令窗口
    */
    public createCommandWindow() {
        const background = window.$dataSystem.titleCommandWindow.background;
        //创建选择框
        const rect = this.commandWindowRect();
        //创建标题命令
        this._commandWindow = new Window_TitleCommand(rect);
        this._commandWindow.setBackgroundType(background);
        this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
        this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
        this._commandWindow.setHandler("options", this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    };

    /**
     * 创建命令窗口
    */
    public commandWindowRect() {
        //窗口偏移量X
        const offsetX = window.$dataSystem.titleCommandWindow.offsetX;
        //窗口偏移量Y
        const offsetY = window.$dataSystem.titleCommandWindow.offsetY;       
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
        const wy = Graphics.boxHeight - wh - 96 + offsetY;
        return new Rectangle(wx, wy, ww, wh);
    };

    public commandNewGame() {
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };

    public commandContinue() {
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    };

    public commandOptions() {
        this._commandWindow.close();
        SceneManager.push(Scene_Options);
    };

    public playTitleMusic() {
        AudioManager.playBgm(window.$dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    };

}
