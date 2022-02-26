import { TextManager, DataManager, SoundManager } from "../Manager/index.js";
import { Scene_File } from "./index.js";
export class Scene_Save extends Scene_File {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(...args) {
        Scene_File.prototype.initialize.call(this);
    }
    ;
    mode() {
        return "save";
    }
    ;
    helpWindowText() {
        return TextManager.saveMessage;
    }
    ;
    firstSavefileId() {
        return window.$gameSystem.savefileId();
    }
    ;
    onSavefileOk() {
        Scene_File.prototype.onSavefileOk.call(this);
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeSave(savefileId);
        }
        else {
            this.onSaveFailure();
        }
    }
    ;
    executeSave(savefileId) {
        window.$gameSystem.setSavefileId(savefileId);
        window.$gameSystem.onBeforeSave();
        DataManager.saveGame(savefileId)
            .then(() => this.onSaveSuccess())
            .catch(() => this.onSaveFailure());
    }
    ;
    onSaveSuccess() {
        SoundManager.playSave();
        this.popScene();
    }
    ;
    onSaveFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }
    ;
}
