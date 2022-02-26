import { DataManager, SceneManager, SoundManager, TextManager } from "../Manager/index.js";
import { Scene_File, Scene_Map } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Load
 * 
 * The scene class of the load screen.
*/
export class Scene_Load extends Scene_File {
    _loadSuccess: boolean;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_File.prototype.initialize.call(this);
        this._loadSuccess = false;
    };

    public terminate() {
        Scene_File.prototype.terminate.call(this);
        if (this._loadSuccess) {
            window.$gameSystem.onAfterLoad();
        }
    };

    public mode() {
        return "load";
    };

    public helpWindowText() {
        return TextManager.loadMessage;
    };

    public firstSavefileId() {
        return DataManager.latestSavefileId();
    };

    public onSavefileOk() {
        Scene_File.prototype.onSavefileOk.call(this);
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeLoad(savefileId);
        } else {
            this.onLoadFailure();
        }
    };

    public executeLoad(savefileId) {
        DataManager.loadGame(savefileId)
            .then(() => this.onLoadSuccess())
            .catch(() => this.onLoadFailure());
    };

    public onLoadSuccess() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    };

    public onLoadFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    };

    public reloadMapIfUpdated() {
        if (window.$gameSystem.versionId() !== window.$dataSystem.versionId) {
            const mapId = window.$gameMap.mapId();
            const x = window.$gamePlayer.x;
            const y = window.$gamePlayer.y;
            window.$gamePlayer.reserveTransfer(mapId, x, y);
            window.$gamePlayer.requestMapReload();
        }
    };
}