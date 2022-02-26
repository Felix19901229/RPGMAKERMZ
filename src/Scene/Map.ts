import { Input, TouchInput, Rectangle, Graphics} from "../Core/index.js";
import { DataManager, ImageManager, EffectManager, SceneManager, ConfigManager, SoundManager, BattleManager, AudioManager } from "../Manager/index.js";
import { Spriteset_Map, Sprite_Button } from "../Spriteset/index.js";
import { Window_MapName, Window_MenuCommand } from "../Window/index.js";
import { Scene_Battle,Scene_Debug,Scene_Gameover,Scene_Load,Scene_Menu,Scene_Message, Scene_Title } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Map
 * 
 * The scene class of the map screen.
*/
export class Scene_Map extends Scene_Message {
    _waitCount: number;
    _encounterEffectDuration: number;
    _mapLoaded: boolean;
    _touchCount: number;
    _menuEnabled: boolean;
    _transfer: boolean;
    _lastMapWasNull: boolean;
    menuCalling: boolean;
    _mapNameWindow: Nullable<Window_MapName>;
    _spriteset: Nullable<Spriteset_Map>;
    _menuButton: Nullable<Sprite_Button>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_Message.prototype.initialize.call(this);
        this._waitCount = 0;
        this._encounterEffectDuration = 0;
        this._mapLoaded = false;
        this._touchCount = 0;
        this._menuEnabled = false;
    };

    public create() {
        Scene_Message.prototype.create.call(this);
        this._transfer = window.$gamePlayer.isTransferring();
        this._lastMapWasNull = !window.$dataMap;
        if (this._transfer) {
            DataManager.loadMapData(window.$gamePlayer.newMapId());
            this.onTransfer();
        } else if (!window.$dataMap || window.$dataMap.id !== window.$gameMap.mapId()) {
            DataManager.loadMapData(window.$gameMap.mapId());
        }
    };

    public isReady() {
        if (!this._mapLoaded && DataManager.isMapLoaded()) {
            this.onMapLoaded();
            this._mapLoaded = true;
        }
        return this._mapLoaded && Scene_Message.prototype.isReady.call(this);
    };

    public onMapLoaded() {
        if (this._transfer) {
            window.$gamePlayer.performTransfer();
        }
        this.createDisplayObjects();
    };

    public onTransfer() {
        ImageManager.clear();
        EffectManager.clear();
    };

    public start() {
        Scene_Message.prototype.start.call(this);
        SceneManager.clearStack();
        if (this._transfer) {
            this.fadeInForTransfer();
            this.onTransferEnd();
        } else if (this.needsFadeIn()) {
            this.startFadeIn(this.fadeSpeed(), false);
        }
        this.menuCalling = false;
    };

    public onTransferEnd() {
        this._mapNameWindow.open();
        window.$gameMap.autoplay();
        if (this.shouldAutosave()) {
            this.requestAutosave();
        }
    };

    public shouldAutosave() {
        return !this._lastMapWasNull;
    };

    public update() {
        Scene_Message.prototype.update.call(this);
        this.updateDestination();
        this.updateMenuButton();
        this.updateMapNameWindow();
        this.updateMainMultiply();
        if (this.isSceneChangeOk()) {
            this.updateScene();
        } else if (SceneManager.isNextScene(Scene_Battle)) {
            this.updateEncounterEffect();
        }
        this.updateWaitCount();
    };

    public updateMainMultiply() {
        if (this.isFastForward()) {
            this.updateMain();
        }
        this.updateMain();
    };

    public updateMain() {
        window.$gameMap.update(this.isActive());
        window.$gamePlayer.update(this.isPlayerActive());
        window.$gameTimer.update(this.isActive());
        window.$gameScreen.update();
    };

    public isPlayerActive() {
        return this.isActive() && !this.isFading();
    };

    public isFastForward() {
        return (
            window.$gameMap.isEventRunning() &&
            !SceneManager.isSceneChanging() &&
            (Input.isLongPressed("ok") || TouchInput.isLongPressed())
        );
    };

    public stop() {
        Scene_Message.prototype.stop.call(this);
        window.$gamePlayer.straighten();
        this._mapNameWindow.close();
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else if (SceneManager.isNextScene(Scene_Map)) {
            this.fadeOutForTransfer();
        } else if (SceneManager.isNextScene(Scene_Battle)) {
            this.launchBattle();
        }
    };

    public isBusy() {
        return (
            this.isMessageWindowClosing() ||
            this._waitCount > 0 ||
            this._encounterEffectDuration > 0 ||
            Scene_Message.prototype.isBusy.call(this)
        );
    };

    public terminate() {
        Scene_Message.prototype.terminate.call(this);
        if (!SceneManager.isNextScene(Scene_Battle)) {
            this._spriteset.update();
            this._mapNameWindow.hide();
            this.hideMenuButton();
            SceneManager.snapForBackground();
        }
        window.$gameScreen.clearZoom();
    };

    public needsFadeIn() {
        return (
            SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_Load)
        );
    };

    public needsSlowFadeOut() {
        return (
            SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover)
        );
    };

    public updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    };

    public updateDestination() {
        if (this.isMapTouchOk()) {
            this.processMapTouch();
        } else {
            window.$gameTemp.clearDestination();
            this._touchCount = 0;
        }
    };

    public updateMenuButton() {
        if (this._menuButton) {
            const menuEnabled = this.isMenuEnabled();
            if (menuEnabled === this._menuEnabled) {
                this._menuButton.visible = this._menuEnabled;
            } else {
                this._menuEnabled = menuEnabled;
            }
        }
    };

    public hideMenuButton() {
        if (this._menuButton) {
            this._menuButton.visible = false;
            this._menuEnabled = false;
        }
    };

    public updateMapNameWindow() {
        if (window.$gameMessage.isBusy()) {
            this._mapNameWindow.close();
        }
    };

    public isMenuEnabled() {
        return window.$gameSystem.isMenuEnabled() && !window.$gameMap.isEventRunning();
    };

    public isMapTouchOk() {
        return this.isActive() && window.$gamePlayer.canMove();
    };

    public processMapTouch() {
        if (TouchInput.isTriggered() || this._touchCount > 0) {
            if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
                if (this._touchCount === 0 || this._touchCount >= 15) {
                    this.onMapTouch();
                }
                this._touchCount++;
            } else {
                this._touchCount = 0;
            }
        }
    };

    public isAnyButtonPressed() {
        return this._menuButton && this._menuButton.isPressed();
    };

    public onMapTouch() {
        const x = window.$gameMap.canvasToMapX(TouchInput.x);
        const y = window.$gameMap.canvasToMapY(TouchInput.y);
        window.$gameTemp.setDestination(x, y);
    };

    public isSceneChangeOk() {
        return this.isActive() && !window.$gameMessage.isBusy();
    };

    public updateScene() {
        this.checkGameover();
        if (!SceneManager.isSceneChanging()) {
            this.updateTransferPlayer();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateEncounter();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallMenu();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallDebug();
        }
    };

    public createDisplayObjects() {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
        this.createButtons();
    };

    public createSpriteset() {
        this._spriteset = new Spriteset_Map();
        //@ts-ignore
        this.addChild(this._spriteset);
        this._spriteset.update();
    };

    public createAllWindows() {
        this.createMapNameWindow();
        Scene_Message.prototype.createAllWindows.call(this);
    };

    public createMapNameWindow() {
        const rect = this.mapNameWindowRect();
        this._mapNameWindow = new Window_MapName(rect);
        this.addWindow(this._mapNameWindow);
    };

    public mapNameWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = 360;
        const wh = this.calcWindowHeight(1, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    public createButtons() {
        if (ConfigManager.touchUI) {
            this.createMenuButton();
        }
    };

    public createMenuButton() {
        this._menuButton = new Sprite_Button("menu");
        this._menuButton.x = Graphics.boxWidth - this._menuButton.width - 4;
        this._menuButton.y = this.buttonY();
        this._menuButton.visible = false;
        this.addWindow(this._menuButton);
    };

    public updateTransferPlayer() {
        if (window.$gamePlayer.isTransferring()) {
            SceneManager.goto(Scene_Map);
        }
    };

    public updateEncounter() {
        if (window.$gamePlayer.executeEncounter()) {
            SceneManager.push(Scene_Battle);
        }
    };

    public updateCallMenu() {
        if (this.isMenuEnabled()) {
            if (this.isMenuCalled()) {
                this.menuCalling = true;
            }
            if (this.menuCalling && !window.$gamePlayer.isMoving()) {
                this.callMenu();
            }
        } else {
            this.menuCalling = false;
        }
    };

    public isMenuCalled() {
        return Input.isTriggered("menu") || TouchInput.isCancelled();
    };

    public callMenu() {
        SoundManager.playOk();
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
        window.$gameTemp.clearDestination();
        this._mapNameWindow.hide();
        this._waitCount = 2;
    };

    public updateCallDebug() {
        if (this.isDebugCalled()) {
            SceneManager.push(Scene_Debug);
        }
    };

    public isDebugCalled() {
        return Input.isTriggered("debug") && window.$gameTemp.isPlaytest();
    };

    public fadeInForTransfer() {
        const fadeType = window.$gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeIn(this.fadeSpeed(), fadeType === 1);
                break;
        }
    };

    public fadeOutForTransfer() {
        const fadeType = window.$gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeOut(this.fadeSpeed(), fadeType === 1);
                break;
        }
    };

    public launchBattle() {
        BattleManager.saveBgmAndBgs();
        this.stopAudioOnBattleStart();
        SoundManager.playBattleStart();
        this.startEncounterEffect();
        this._mapNameWindow.hide();
    };

    public stopAudioOnBattleStart() {
        if (!AudioManager.isCurrentBgm(window.$gameSystem.battleBgm())) {
            AudioManager.stopBgm();
        }
        AudioManager.stopBgs();
        AudioManager.stopMe();
        AudioManager.stopSe();
    };

    public startEncounterEffect() {
        this._spriteset.hideCharacters();
        this._encounterEffectDuration = this.encounterEffectSpeed();
    };

    public updateEncounterEffect() {
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            const speed = this.encounterEffectSpeed();
            const n = speed - this._encounterEffectDuration;
            const p = n / speed;
            const q = ((p - 1) * 20 * p + 5) * p + 1;
            const zoomX = window.$gamePlayer.screenX();
            const zoomY = window.$gamePlayer.screenY() - 24;
            if (n === 2) {
                window.$gameScreen.setZoom(zoomX, zoomY, 1);
                this.snapForBattleBackground();
                this.startFlashForEncounter(speed / 2);
            }
            window.$gameScreen.setZoom(zoomX, zoomY, q);
            if (n === Math.floor(speed / 6)) {
                this.startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
        }
    };

    public snapForBattleBackground() {
        this._windowLayer.visible = false;
        SceneManager.snapForBackground();
        this._windowLayer.visible = true;
    };

    public startFlashForEncounter(duration) {
        const color = [255, 255, 255, 255];
        window.$gameScreen.startFlash(color, duration);
    };

    public encounterEffectSpeed() {
        return 60;
    };
}
