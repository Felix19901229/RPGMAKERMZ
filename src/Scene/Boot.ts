import { Utils, Graphics } from "../Core/index.js";
import { DataManager, StorageManager, ColorManager, ImageManager, ConfigManager, FontManager, SoundManager, SceneManager } from "../Manager/index.js";
import { Window_TitleCommand } from "../Window/index.js";
import { Scene_Base, Scene_Battle, Scene_Map, Scene_Title } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Boot
 * 
 * The scene class for initializing the entire game.
*/
export class Scene_Boot extends Scene_Base {
    _databaseLoaded: boolean;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_Base.prototype.initialize.call(this);
        this._databaseLoaded = false;
    };

    public create() {
        Scene_Base.prototype.create.call(this);
        DataManager.loadDatabase();
        StorageManager.updateForageKeys();
    };

    public isReady() {
        if (!this._databaseLoaded) {
            if (
                DataManager.isDatabaseLoaded() &&
                StorageManager.forageKeysUpdated()
            ) {
                this._databaseLoaded = true;
                this.onDatabaseLoaded();
            }
            return false;
        }
        return Scene_Base.prototype.isReady.call(this) && this.isPlayerDataLoaded();
    };

    public onDatabaseLoaded() {
        this.setEncryptionInfo();        
        this.loadSystemImages();
        this.loadPlayerData();
        this.loadGameFonts();
    };

    public setEncryptionInfo() {
        const hasImages = window.$dataSystem.hasEncryptedImages;
        const hasAudio = window.$dataSystem.hasEncryptedAudio;
        const key = window.$dataSystem.encryptionKey;
        Utils.setEncryptionInfo(hasImages, hasAudio, key);
    };

    public loadSystemImages() {
        ColorManager.loadWindowskin();
        ImageManager.loadSystem("IconSet");
    };

    public loadPlayerData() {
        DataManager.loadGlobalInfo();
        ConfigManager.load();
    };

    public loadGameFonts() {
        const advanced = window.$dataSystem.advanced;
        FontManager.load("rmmz-mainfont", advanced.mainFontFilename);
        FontManager.load("rmmz-numberfont", advanced.numberFontFilename);
    };

    public isPlayerDataLoaded() {
        return DataManager.isGlobalInfoLoaded() && ConfigManager.isLoaded();
    };

    public start() {
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        } else if (DataManager.isEventTest()) {
            DataManager.setupEventTest();
            SceneManager.goto(Scene_Map);
        } else {
            this.startNormalGame();
        }
        this.resizeScreen();
        this.updateDocumentTitle();
    };

    public startNormalGame() {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Title);
        Window_TitleCommand.initCommandPosition();
    };

    public resizeScreen() {
        const screenWidth = window.$dataSystem.advanced.screenWidth;
        const screenHeight = window.$dataSystem.advanced.screenHeight;
        Graphics.resize(screenWidth, screenHeight);
        this.adjustBoxSize();
        this.adjustWindow();
    };

    public adjustBoxSize() {
        const uiAreaWidth = window.$dataSystem.advanced.uiAreaWidth;
        const uiAreaHeight = window.$dataSystem.advanced.uiAreaHeight;
        const boxMargin = 4;
        Graphics.boxWidth = uiAreaWidth - boxMargin * 2;
        Graphics.boxHeight = uiAreaHeight - boxMargin * 2;
    };

    public adjustWindow() {
        if (Utils.isNwjs()) {
            const xDelta = Graphics.width - window.innerWidth;
            const yDelta = Graphics.height - window.innerHeight;
            window.moveBy(-xDelta / 2, -yDelta / 2);
            window.resizeBy(xDelta, yDelta);
        }
    };

    public updateDocumentTitle() {
        document.title = window.$dataSystem.gameTitle;
    };

    public checkPlayerLocation() {
        if (window.$dataSystem.startMapId === 0) {
            throw new Error("Player's starting position is not set");
        }
    };
}

