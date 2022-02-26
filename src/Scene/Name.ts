import { Graphics, Rectangle } from "../Core/index.js";
import { ImageManager } from "../Manager/index.js";
import { Window_NameEdit, Window_NameInput } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Name
 * 
 * The scene class of the name input screen.
*/
export class Scene_Name extends Scene_MenuBase {
    _actorId: number;
    _maxLength: number;
    _editWindow: Nullable<Window_NameEdit>;
    _inputWindow: Nullable<Window_NameInput>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    public prepare(actorId, maxLength) {
        this._actorId = actorId;
        this._maxLength = maxLength;
    };

    public create() {
        Scene_MenuBase.prototype.create.call(this);
        this._actor = window.$gameActors.actor(this._actorId);
        this.createEditWindow();
        this.createInputWindow();
    };

    public start() {
        Scene_MenuBase.prototype.start.call(this);
        this._editWindow.refresh();
    };

    public createEditWindow() {
        const rect = this.editWindowRect();
        this._editWindow = new Window_NameEdit(rect);
        this._editWindow.setup(this._actor, this._maxLength);
        this.addWindow(this._editWindow);
    };

    public editWindowRect() {
        const inputWindowHeight = this.calcWindowHeight(9, true);
        const padding = window.$gameSystem.windowPadding();
        const ww = 600;
        const wh = ImageManager.faceHeight + padding * 2;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createInputWindow() {
        const rect = this.inputWindowRect();
        this._inputWindow = new Window_NameInput(rect);
        this._inputWindow.setEditWindow(this._editWindow);
        this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
        this.addWindow(this._inputWindow);
    };

    public inputWindowRect() {
        const wx = this._editWindow.x;
        const wy = this._editWindow.y + this._editWindow.height + 8;
        const ww = this._editWindow.width;
        const wh = this.calcWindowHeight(9, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    public onInputOk() {
        this._actor.setName(this._editWindow.name());
        this.popScene();
    };

}
