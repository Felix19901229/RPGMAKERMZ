import { Graphics, Rectangle } from "../Core/index.js";
import { Window_Help, Window_Status, Window_StatusParams, Window_StatusEquip } from "../Window/index.js";
import { Scene_MenuBase } from "./index.js";
export class Scene_Status extends Scene_MenuBase {
    _profileWindow;
    _statusWindow;
    _statusParamsWindow;
    _statusEquipWindow;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(...args) {
        Scene_MenuBase.prototype.initialize.call(this);
    }
    ;
    create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createProfileWindow();
        this.createStatusWindow();
        this.createStatusParamsWindow();
        this.createStatusEquipWindow();
    }
    ;
    helpAreaHeight() {
        return 0;
    }
    ;
    createProfileWindow() {
        const rect = this.profileWindowRect();
        this._profileWindow = new Window_Help(rect);
        this.addWindow(this._profileWindow);
    }
    ;
    profileWindowRect() {
        const ww = Graphics.boxWidth;
        const wh = this.profileHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - wh;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_Status(rect);
        this._statusWindow.setHandler("cancel", this.popScene.bind(this));
        this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._statusWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._statusWindow);
    }
    ;
    statusWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.statusParamsWindowRect().y - wy;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    createStatusParamsWindow() {
        const rect = this.statusParamsWindowRect();
        this._statusParamsWindow = new Window_StatusParams(rect);
        this.addWindow(this._statusParamsWindow);
    }
    ;
    statusParamsWindowRect() {
        const ww = this.statusParamsWidth();
        const wh = this.statusParamsHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - this.profileHeight() - wh;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    createStatusEquipWindow() {
        const rect = this.statusEquipWindowRect();
        this._statusEquipWindow = new Window_StatusEquip(rect);
        this.addWindow(this._statusEquipWindow);
    }
    ;
    statusEquipWindowRect() {
        const ww = Graphics.boxWidth - this.statusParamsWidth();
        const wh = this.statusParamsHeight();
        const wx = this.statusParamsWidth();
        const wy = this.mainAreaBottom() - this.profileHeight() - wh;
        return new Rectangle(wx, wy, ww, wh);
    }
    ;
    statusParamsWidth() {
        return 300;
    }
    ;
    statusParamsHeight() {
        return this.calcWindowHeight(6, false);
    }
    ;
    profileHeight() {
        return this.calcWindowHeight(2, false);
    }
    ;
    start() {
        Scene_MenuBase.prototype.start.call(this);
        this.refreshActor();
    }
    ;
    needsPageButtons() {
        return true;
    }
    ;
    refreshActor() {
        const actor = this.actor();
        this._profileWindow.setText(actor.profile());
        this._statusWindow.setActor(actor);
        this._statusParamsWindow.setActor(actor);
        this._statusEquipWindow.setActor(actor);
    }
    ;
    onActorChange() {
        Scene_MenuBase.prototype.onActorChange.call(this);
        this.refreshActor();
        this._statusWindow.activate();
    }
    ;
}
