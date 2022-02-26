import { TextManager, DataManager, SoundManager } from "../Manager/index.js";
import { Scene_File } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Save
 * 
 * The scene class of the save screen.
*/
export class Scene_Save extends Scene_File {
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);

    }

    public initialize(...args) {
        Scene_File.prototype.initialize.call(this);
    };

    public mode() {
        return "save";
    };

    public helpWindowText() {
        return TextManager.saveMessage;
    };

    public firstSavefileId() {
        return window.$gameSystem.savefileId();
    };

    public onSavefileOk() {
        Scene_File.prototype.onSavefileOk.call(this);
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeSave(savefileId);
        } else {
            this.onSaveFailure();
        }
    };

    public executeSave(savefileId) {
        window.$gameSystem.setSavefileId(savefileId);
        window.$gameSystem.onBeforeSave();
        DataManager.saveGame(savefileId)
            .then(() => this.onSaveSuccess())
            .catch(() => this.onSaveFailure());
    };

    public onSaveSuccess() {
        SoundManager.playSave();
        this.popScene();
    };

    public onSaveFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    };
}

