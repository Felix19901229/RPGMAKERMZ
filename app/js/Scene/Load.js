import { DataManager, SceneManager, SoundManager, TextManager } from "../Manager/index.js";
import { Scene_File, Scene_Map } from "./index.js";
export class Scene_Load extends Scene_File {
    _loadSuccess;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(...args) {
        Scene_File.prototype.initialize.call(this);
        this._loadSuccess = false;
    }
    ;
    terminate() {
        Scene_File.prototype.terminate.call(this);
        if (this._loadSuccess) {
            window.$gameSystem.onAfterLoad();
        }
    }
    ;
    mode() {
        return "load";
    }
    ;
    helpWindowText() {
        return TextManager.loadMessage;
    }
    ;
    firstSavefileId() {
        return DataManager.latestSavefileId();
    }
    ;
    onSavefileOk() {
        Scene_File.prototype.onSavefileOk.call(this);
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeLoad(savefileId);
        }
        else {
            this.onLoadFailure();
        }
    }
    ;
    executeLoad(savefileId) {
        DataManager.loadGame(savefileId)
            .then(() => this.onLoadSuccess())
            .catch(() => this.onLoadFailure());
    }
    ;
    onLoadSuccess() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    }
    ;
    onLoadFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }
    ;
    reloadMapIfUpdated() {
        if (window.$gameSystem.versionId() !== window.$dataSystem.versionId) {
            const mapId = window.$gameMap.mapId();
            const x = window.$gamePlayer.x;
            const y = window.$gamePlayer.y;
            window.$gamePlayer.reserveTransfer(mapId, x, y);
            window.$gamePlayer.requestMapReload();
        }
    }
    ;
}
