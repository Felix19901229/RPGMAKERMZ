import { Graphics, Rectangle } from "../Core/index.js";
import { BattleManager, AudioManager, SceneManager, ConfigManager } from "../Manager/index.js";
import { Spriteset_Battle, Sprite_Button } from "../Spriteset/index.js";
import { Window_BattleLog, Window_BattleStatus, Window_PartyCommand, Window_ActorCommand, Window_Help, Window_BattleSkill, Window_BattleItem, Window_BattleActor, Window_BattleEnemy } from "../Window/index.js";
import { Scene_Gameover, Scene_Map, Scene_Message, Scene_Title } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Scene_Battle
 * 
 * The scene class of the battle screen.
*/
export class Scene_Battle extends Scene_Message {
    _statusWindow: Nullable<Window_BattleStatus>;
    _skillWindow: Nullable<Window_BattleSkill>;
    _itemWindow: Nullable<Window_BattleItem>;
    _partyCommandWindow: Nullable<Window_PartyCommand>;
    _actorCommandWindow: Nullable<Window_ActorCommand>;
    _actorWindow: Nullable<Window_BattleActor>;
    _enemyWindow: Nullable<Window_BattleEnemy>;
    _logWindow: Nullable<Window_BattleLog>;
    _helpWindow: Nullable<Window_Help>;
    _cancelButton: Nullable<Sprite_Button>;
    _spriteset:Nullable<Spriteset_Battle>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_Message.prototype.initialize.call(this);
    };

    public create() {
        Scene_Message.prototype.create.call(this);
        this.createDisplayObjects();
    };

    public start() {
        Scene_Message.prototype.start.call(this);
        BattleManager.playBattleBgm();
        BattleManager.startBattle();
        this._statusWindow.refresh();
        this.startFadeIn(this.fadeSpeed(), false);
    };

    public update() {
        const active = this.isActive();
        window.$gameTimer.update(active);
        window.$gameScreen.update();
        this.updateVisibility();
        if (active && !this.isBusy()) {
            this.updateBattleProcess();
        }
        Scene_Message.prototype.update.call(this);
    };

    public updateVisibility() {
        this.updateLogWindowVisibility();
        this.updateStatusWindowVisibility();
        this.updateInputWindowVisibility();
        this.updateCancelButton();
    };

    public updateBattleProcess() {
        BattleManager.update(this.isTimeActive());
    };

    public isTimeActive() {
        if (BattleManager.isActiveTpb()) {
            return !this._skillWindow.active && !this._itemWindow.active;
        } else {
            return !this.isAnyInputWindowActive();
        }
    };

    public isAnyInputWindowActive() {
        return (
            this._partyCommandWindow.active ||
            this._actorCommandWindow.active ||
            this._skillWindow.active ||
            this._itemWindow.active ||
            this._actorWindow.active ||
            this._enemyWindow.active
        );
    };

    public changeInputWindow() {
        this.hideSubInputWindows();
        if (BattleManager.isInputting()) {
            if (BattleManager.actor()) {
                this.startActorCommandSelection();
            } else {
                this.startPartyCommandSelection();
            }
        } else {
            this.endCommandSelection();
        }
    };

    public stop() {
        Scene_Message.prototype.stop.call(this);
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else {
            this.startFadeOut(this.fadeSpeed(), false);
        }
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    };

    public terminate() {
        Scene_Message.prototype.terminate.call(this);
        window.$gameParty.onBattleEnd();
        window.$gameTroop.onBattleEnd();
        AudioManager.stopMe();
        if (this.shouldAutosave()) {
            this.requestAutosave();
        }
    };

    public shouldAutosave() {
        return SceneManager.isNextScene(Scene_Map);
    };

    public needsSlowFadeOut() {
        return (
            SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover)
        );
    };

    public updateLogWindowVisibility() {
        this._logWindow.visible = !this._helpWindow.visible;
    };

    public updateStatusWindowVisibility() {
        if (window.$gameMessage.isBusy()) {
            this._statusWindow.close();
        } else if (this.shouldOpenStatusWindow()) {
            this._statusWindow.open();
        }
        this.updateStatusWindowPosition();
    };

    public shouldOpenStatusWindow() {
        return (
            this.isActive() &&
            !this.isMessageWindowClosing() &&
            !BattleManager.isBattleEnd()
        );
    };

    public updateStatusWindowPosition() {
        const statusWindow = this._statusWindow;
        const targetX = this.statusWindowX();
        if (statusWindow.x < targetX) {
            statusWindow.x = Math.min(statusWindow.x + 16, targetX);
        }
        if (statusWindow.x > targetX) {
            statusWindow.x = Math.max(statusWindow.x - 16, targetX);
        }
    };

    public statusWindowX() {
        if (this.isAnyInputWindowActive()) {
            return this.statusWindowRect().x;
        } else {
            return this._partyCommandWindow.width / 2;
        }
    };

    public updateInputWindowVisibility() {
        if (window.$gameMessage.isBusy()) {
            this.closeCommandWindows();
            this.hideSubInputWindows();
        } else if (this.needsInputWindowChange()) {
            this.changeInputWindow();
        }
    };

    public needsInputWindowChange() {
        const windowActive = this.isAnyInputWindowActive();
        const inputting = BattleManager.isInputting();
        if (windowActive && inputting) {
            return this._actorCommandWindow.actor() !== BattleManager.actor();
        }
        return windowActive !== inputting;
    };

    public updateCancelButton() {
        if (this._cancelButton) {
            this._cancelButton.visible =
                this.isAnyInputWindowActive() && !this._partyCommandWindow.active;
        }
    };

    public createDisplayObjects() {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
        this.createButtons();
        BattleManager.setLogWindow(this._logWindow);
        BattleManager.setSpriteset(this._spriteset);
        this._logWindow.setSpriteset(this._spriteset);
    } 
 

    public createSpriteset() {
        this._spriteset = new Spriteset_Battle();
        //@ts-ignore
        this.addChild(this._spriteset);
    };

    public createAllWindows() {
        this.createLogWindow();
        this.createStatusWindow();
        this.createPartyCommandWindow();
        this.createActorCommandWindow();
        this.createHelpWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createActorWindow();
        this.createEnemyWindow();
        Scene_Message.prototype.createAllWindows.call(this);
    };

    public createLogWindow() {
        const rect = this.logWindowRect();
        this._logWindow = new Window_BattleLog(rect);
        this.addWindow(this._logWindow);
    };

    public logWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(10, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    public createStatusWindow() {
        const rect = this.statusWindowRect();
        const statusWindow = new Window_BattleStatus(rect);
        this.addWindow(statusWindow);
        this._statusWindow = statusWindow;
    };

    public statusWindowRect() {
        const extra = 10;
        const ww = Graphics.boxWidth - 192;
        const wh = this.windowAreaHeight() + extra;
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = Graphics.boxHeight - wh + extra - 4;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createPartyCommandWindow() {
        const rect = this.partyCommandWindowRect();
        const commandWindow = new Window_PartyCommand(rect);
        commandWindow.setHandler("fight", this.commandFight.bind(this));
        commandWindow.setHandler("escape", this.commandEscape.bind(this));
        commandWindow.deselect();
        this.addWindow(commandWindow);
        this._partyCommandWindow = commandWindow;
    };

    public partyCommandWindowRect() {
        const ww = 192;
        const wh = this.windowAreaHeight();
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createActorCommandWindow() {
        const rect = this.actorCommandWindowRect();
        const commandWindow = new Window_ActorCommand(rect);
        commandWindow.y = Graphics.boxHeight - commandWindow.height;
        commandWindow.setHandler("attack", this.commandAttack.bind(this));
        commandWindow.setHandler("skill", this.commandSkill.bind(this));
        commandWindow.setHandler("guard", this.commandGuard.bind(this));
        commandWindow.setHandler("item", this.commandItem.bind(this));
        commandWindow.setHandler("cancel", this.commandCancel.bind(this));
        this.addWindow(commandWindow);
        this._actorCommandWindow = commandWindow;
    };

    public actorCommandWindowRect() {
        const ww = 192;
        const wh = this.windowAreaHeight();
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this._helpWindow.hide();
        this.addWindow(this._helpWindow);
    };

    public helpWindowRect() {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    public createSkillWindow() {
        const rect = this.skillWindowRect();
        this._skillWindow = new Window_BattleSkill(rect);
        this._skillWindow.setHelpWindow(this._helpWindow);
        this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
        this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
        this.addWindow(this._skillWindow);
    };

    public skillWindowRect() {
        const ww = Graphics.boxWidth;
        const wh = this.windowAreaHeight();
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createItemWindow() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_BattleItem(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
    };

    public itemWindowRect() {
        return this.skillWindowRect();
    };

    public createActorWindow() {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_BattleActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    };

    public actorWindowRect() {
        return this.statusWindowRect();
    };

    public createEnemyWindow() {
        const rect = this.enemyWindowRect();
        this._enemyWindow = new Window_BattleEnemy(rect);
        this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
        this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
        this.addWindow(this._enemyWindow);
    };

    public enemyWindowRect() {
        const wx = this._statusWindow.x;
        const ww = this._statusWindow.width;
        const wh = this.windowAreaHeight();
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    public helpAreaTop() {
        return 0;
    };

    public helpAreaBottom() {
        return this.helpAreaTop() + this.helpAreaHeight();
    };

    public helpAreaHeight() {
        return this.calcWindowHeight(2, false);
    };

    public buttonAreaTop() {
        return this.helpAreaBottom();
    };

    public windowAreaHeight() {
        return this.calcWindowHeight(4, true);
    };

    public createButtons() {
        if (ConfigManager.touchUI) {
            this.createCancelButton();
        }
    };

    public createCancelButton() {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    };

    public closeCommandWindows() {
        this._partyCommandWindow.deactivate();
        this._actorCommandWindow.deactivate();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    };

    public hideSubInputWindows() {
        this._actorWindow.deactivate();
        this._enemyWindow.deactivate();
        this._skillWindow.deactivate();
        this._itemWindow.deactivate();
        this._actorWindow.hide();
        this._enemyWindow.hide();
        this._skillWindow.hide();
        this._itemWindow.hide();
    };

    public startPartyCommandSelection() {
        this._statusWindow.deselect();
        this._statusWindow.show();
        this._statusWindow.open();
        this._actorCommandWindow.setup(null);
        this._actorCommandWindow.close();
        this._partyCommandWindow.setup();
    };

    public commandFight() {
        this.selectNextCommand();
    };

    public commandEscape() {
        BattleManager.processEscape();
        this.changeInputWindow();
    };

    public startActorCommandSelection() {
        this._statusWindow.show();
        this._statusWindow.selectActor(BattleManager.actor());
        this._partyCommandWindow.close();
        this._actorCommandWindow.show();
        this._actorCommandWindow.setup(BattleManager.actor());
    };

    public commandAttack() {
        const action = BattleManager.inputtingAction();
        action.setAttack();
        this.onSelectAction();
    };

    public commandSkill() {
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
        this._statusWindow.hide();
        this._actorCommandWindow.hide();
    };

    public commandGuard() {
        const action = BattleManager.inputtingAction();
        action.setGuard();
        this.onSelectAction();
    };

    public commandItem() {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
        this._statusWindow.hide();
        this._actorCommandWindow.hide();
    };

    public commandCancel() {
        this.selectPreviousCommand();
    };

    public selectNextCommand() {
        BattleManager.selectNextCommand();
        this.changeInputWindow();
    };

    public selectPreviousCommand() {
        BattleManager.selectPreviousCommand();
        this.changeInputWindow();
    };

    public startActorSelection() {
        this._actorWindow.refresh();
        this._actorWindow.show();
        this._actorWindow.activate();
    };

    public onActorOk() {
        const action = BattleManager.inputtingAction();
        action.setTarget(this._actorWindow.index());
        this.hideSubInputWindows();
        this.selectNextCommand();
    };

    public onActorCancel() {
        this._actorWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    };

    public startEnemySelection() {
        this._enemyWindow.refresh();
        this._enemyWindow.show();
        this._enemyWindow.select(0);
        this._enemyWindow.activate();
        this._statusWindow.hide();
    };

    public onEnemyOk() {
        const action = BattleManager.inputtingAction();
        action.setTarget(this._enemyWindow.enemyIndex());
        this.hideSubInputWindows();
        this.selectNextCommand();
    };

    public onEnemyCancel() {
        this._enemyWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "attack":
                this._statusWindow.show();
                this._actorCommandWindow.activate();
                break;
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    };

    public onSkillOk() {
        const skill = this._skillWindow.item();
        const action = BattleManager.inputtingAction();
        action.setSkill(skill.id);
        BattleManager.actor().setLastBattleSkill(skill);
        this.onSelectAction();
    };

    public onSkillCancel() {
        this._skillWindow.hide();
        this._statusWindow.show();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    };

    public onItemOk() {
        const item = this._itemWindow.item();
        const action = BattleManager.inputtingAction();
        action.setItem(item.id);
        window.$gameParty.setLastItem(item);
        this.onSelectAction();
    };

    public onItemCancel() {
        this._itemWindow.hide();
        this._statusWindow.show();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    };

    public onSelectAction() {
        const action = BattleManager.inputtingAction();
        if (!action.needsSelection()) {
            this.selectNextCommand();
        } else if (action.isForOpponent()) {
            this.startEnemySelection();
        } else {
            this.startActorSelection();
        }
    };

    public endCommandSelection() {
        this.closeCommandWindows();
        this.hideSubInputWindows();
        this._statusWindow.deselect();
        this._statusWindow.show();
    };
}
