import { Graphics, Rectangle } from "../Core/index.js";
import { Window_Help, Window_Status, Window_StatusParams, Window_StatusEquip } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Scene_Status
 * 
 * The scene class of the status screen.
*/
export class Scene_Status extends Scene_MenuBase {
    _profileWindow: Nullable<Window_Help>;
    _statusWindow: Nullable<Window_Status>;
    _statusParamsWindow: Nullable<Window_StatusParams>;
    _statusEquipWindow: Nullable<Window_StatusEquip>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    public create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createProfileWindow();
        this.createStatusWindow();
        this.createStatusParamsWindow();
        this.createStatusEquipWindow();
    };

    public helpAreaHeight() {
        return 0;
    };

    public createProfileWindow() {
        const rect = this.profileWindowRect();
        this._profileWindow = new Window_Help(rect);
        this.addWindow(this._profileWindow);
    };

    public profileWindowRect() {
        const ww = Graphics.boxWidth;
        const wh = this.profileHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_Status(rect);
        this._statusWindow.setHandler("cancel", this.popScene.bind(this));
        this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._statusWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._statusWindow);
    };

    public statusWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.statusParamsWindowRect().y - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createStatusParamsWindow() {
        const rect = this.statusParamsWindowRect();
        this._statusParamsWindow = new Window_StatusParams(rect);
        this.addWindow(this._statusParamsWindow);
    };

    public statusParamsWindowRect() {
        const ww = this.statusParamsWidth();
        const wh = this.statusParamsHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - this.profileHeight() - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createStatusEquipWindow() {
        const rect = this.statusEquipWindowRect();
        this._statusEquipWindow = new Window_StatusEquip(rect);
        this.addWindow(this._statusEquipWindow);
    };

    public statusEquipWindowRect() {
        const ww = Graphics.boxWidth - this.statusParamsWidth();
        const wh = this.statusParamsHeight();
        const wx = this.statusParamsWidth();
        const wy = this.mainAreaBottom() - this.profileHeight() - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    public statusParamsWidth() {
        return 300;
    };

    public statusParamsHeight() {
        return this.calcWindowHeight(6, false);
    };

    public profileHeight() {
        return this.calcWindowHeight(2, false);
    };

    public start() {
        Scene_MenuBase.prototype.start.call(this);
        this.refreshActor();
    };

    public needsPageButtons() {
        return true;
    };

    public refreshActor() {
        const actor = this.actor();
        this._profileWindow.setText(actor.profile());
        this._statusWindow.setActor(actor);
        this._statusParamsWindow.setActor(actor);
        this._statusEquipWindow.setActor(actor);
    };

    public onActorChange() {
        Scene_MenuBase.prototype.onActorChange.call(this);
        this.refreshActor();
        this._statusWindow.activate();
    };
}
