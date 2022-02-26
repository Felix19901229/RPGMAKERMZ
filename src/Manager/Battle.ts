
import { Scene_Gameover } from "../Scene/index.js";
import { Game_Action, Game_Actor } from "../Game/index.js";
import { AudioManager, SceneManager, SoundManager, TextManager } from "./index.js";

type Rewards = {
    gold?: number;
    exp?: number;
    items?: Item[];
}
//-----------------------------------------------------------------------------
/**
 * BattleManager
 * 
 * The static class that manages battle progress.
*/
export class BattleManager {
    static _canEscape: boolean;
    static _canLose: boolean;
    static _phase: string;
    static _inputting: boolean;
    static _battleTest: boolean;
    static _eventCallback: any;
    static _preemptive: boolean;
    static _surprise: boolean;
    static _currentActor: Nullable<Game_Actor>;
    static _actionForcedBattler: any;
    static _mapBgm: any;
    static _mapBgs: any;
    static _actionBattlers: any[];
    static _subject: any;
    static _action: any;
    static _targets: any[];
    static _logWindow: any;
    static _spriteset: any;
    static _escapeRatio: number;
    static _escaped: boolean;
    static _rewards: Rewards;
    static _tpbNeedsPartyCommand: boolean;
    constructor() {
        throw new Error("This is a static class");
    }

    static setup(troopId, canEscape, canLose) {
        this.initMembers();
        this._canEscape = canEscape;
        this._canLose = canLose;
        window.$gameTroop.setup(troopId);
        window.$gameScreen.onBattleStart();
        this.makeEscapeRatio();
    };

    static initMembers() {
        this._phase = "";
        this._inputting = false;
        this._canEscape = false;
        this._canLose = false;
        this._battleTest = false;
        this._eventCallback = null;
        this._preemptive = false;
        this._surprise = false;
        this._currentActor = null;
        this._actionForcedBattler = null;
        this._mapBgm = null;
        this._mapBgs = null;
        this._actionBattlers = [];
        this._subject = null;
        this._action = null;
        this._targets = [];
        this._logWindow = null;
        this._spriteset = null;
        this._escapeRatio = 0;
        this._escaped = false;
        this._rewards = {};
        this._tpbNeedsPartyCommand = true;
    };

    static isTpb() {
        return window.$dataSystem.battleSystem >= 1;
    };

    static isActiveTpb() {
        return window.$dataSystem.battleSystem === 1;
    };

    static isBattleTest() {
        return this._battleTest;
    };

    static setBattleTest(battleTest) {
        this._battleTest = battleTest;
    };

    static setEventCallback(callback) {
        this._eventCallback = callback;
    };

    static setLogWindow(logWindow) {
        this._logWindow = logWindow;
    };

    static setSpriteset(spriteset) {
        this._spriteset = spriteset;
    };

    static onEncounter() {
        this._preemptive = Math.random() < this.ratePreemptive();
        this._surprise = Math.random() < this.rateSurprise() && !this._preemptive;
    };

    static ratePreemptive() {
        return window.$gameParty.ratePreemptive(window.$gameTroop.agility());
    };

    static rateSurprise() {
        return window.$gameParty.rateSurprise(window.$gameTroop.agility());
    };

    static saveBgmAndBgs() {
        this._mapBgm = AudioManager.saveBgm();
        this._mapBgs = AudioManager.saveBgs();
    };

    static playBattleBgm() {
        AudioManager.playBgm(window.$gameSystem.battleBgm());
        AudioManager.stopBgs();
    };

    static playVictoryMe() {
        AudioManager.playMe(window.$gameSystem.victoryMe());
    };

    static playDefeatMe() {
        AudioManager.playMe(window.$gameSystem.defeatMe());
    };

    static replayBgmAndBgs() {
        if (this._mapBgm) {
            AudioManager.replayBgm(this._mapBgm);
        } else {
            AudioManager.stopBgm();
        }
        if (this._mapBgs) {
            AudioManager.replayBgs(this._mapBgs);
        }
    };

    static makeEscapeRatio() {
        this._escapeRatio = (0.5 * window.$gameParty.agility()) / window.$gameTroop.agility();
    };

    static update(timeActive) {
        if (!this.isBusy() && !this.updateEvent()) {
            this.updatePhase(timeActive);
        }
        if (this.isTpb()) {
            this.updateTpbInput();
        }
    };

    static updatePhase(timeActive) {
        switch (this._phase) {
            case "start":
                this.updateStart();
                break;
            case "turn":
                this.updateTurn(timeActive);
                break;
            case "action":
                this.updateAction();
                break;
            case "turnEnd":
                this.updateTurnEnd();
                break;
            case "battleEnd":
                this.updateBattleEnd();
                break;
        }
    };

    static updateEvent() {
        switch (this._phase) {
            case "start":
            case "turn":
            case "turnEnd":
                if (this.isActionForced()) {
                    this.processForcedAction();
                    return true;
                } else {
                    return this.updateEventMain();
                }
        }
        return this.checkAbort();
    };

    static updateEventMain() {
        window.$gameTroop.updateInterpreter();
        window.$gameParty.requestMotionRefresh();
        if (window.$gameTroop.isEventRunning() || this.checkBattleEnd()) {
            return true;
        }
        window.$gameTroop.setupBattleEvent();
        if (window.$gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
            return true;
        }
        return false;
    };

    static isBusy() {
        return (
            window.$gameMessage.isBusy() ||
            this._spriteset.isBusy() ||
            this._logWindow.isBusy()
        );
    };

    static updateTpbInput() {
        if (this._inputting) {
            this.checkTpbInputClose();
        } else {
            this.checkTpbInputOpen();
        }
    };

    static checkTpbInputClose() {
        if (!this.isPartyTpbInputtable() || this.needsActorInputCancel()) {
            this.cancelActorInput();
            this._currentActor = null;
            this._inputting = false;
        }
    };

    static checkTpbInputOpen() {
        if (this.isPartyTpbInputtable()) {
            if (this._tpbNeedsPartyCommand) {
                this._inputting = true;
                this._tpbNeedsPartyCommand = false;
            } else {
                this.selectNextCommand();
            }
        }
    };

    static isPartyTpbInputtable() {
        return window.$gameParty.canInput() && this.isTpbMainPhase();
    };

    static needsActorInputCancel() {
        return this._currentActor && !this._currentActor.canInput();
    };

    static isTpbMainPhase() {
        return ["turn", "turnEnd", "action"].includes(this._phase);
    };

    static isInputting() {
        return this._inputting;
    };

    static isInTurn() {
        return this._phase === "turn";
    };

    static isTurnEnd() {
        return this._phase === "turnEnd";
    };

    static isAborting() {
        return this._phase === "aborting";
    };

    static isBattleEnd() {
        return this._phase === "battleEnd";
    };

    static canEscape() {
        return this._canEscape;
    };

    static canLose() {
        return this._canLose;
    };

    static isEscaped() {
        return this._escaped;
    };

    static actor() {
        return this._currentActor;
    };

    static startBattle() {
        this._phase = "start";
        window.$gameSystem.onBattleStart();
        window.$gameParty.onBattleStart(this._preemptive);
        window.$gameTroop.onBattleStart(this._surprise);
        this.displayStartMessages();
    };

    static displayStartMessages() {
        for (const name of window.$gameTroop.enemyNames()) {
            window.$gameMessage.add(TextManager.emerge.format(name));
        }
        if (this._preemptive) {
            window.$gameMessage.add(TextManager.preemptive.format(window.$gameParty.name()));
        } else if (this._surprise) {
            window.$gameMessage.add(TextManager.surprise.format(window.$gameParty.name()));
        }
    };

    static startInput() {
        this._phase = "input";
        this._inputting = true;
        window.$gameParty.makeActions();
        window.$gameTroop.makeActions();
        this._currentActor = null;
        if (this._surprise || !window.$gameParty.canInput()) {
            this.startTurn();
        }
    };

    static inputtingAction() {
        return this._currentActor ? this._currentActor.inputtingAction() : null;
    };

    static selectNextCommand() {
        if (this._currentActor) {
            if (this._currentActor.selectNextCommand()) {
                return;
            }
            this.finishActorInput();
        }
        this.selectNextActor();
    };

    static selectNextActor() {
        this.changeCurrentActor(true);
        if (!this._currentActor) {
            if (this.isTpb()) {
                this.changeCurrentActor(true);
            } else {
                this.startTurn();
            }
        }
    };

    static selectPreviousCommand() {
        if (this._currentActor) {
            if (this._currentActor.selectPreviousCommand()) {
                return;
            }
            this.cancelActorInput();
        }
        this.selectPreviousActor();
    };

    static selectPreviousActor() {
        if (this.isTpb()) {
            this.changeCurrentActor(true);
            if (!this._currentActor) {
                this._inputting = window.$gameParty.canInput();
            }
        } else {
            this.changeCurrentActor(false);
        }
    };

    static changeCurrentActor(forward) {
        const members = window.$gameParty.battleMembers();
        let actor = this._currentActor;
        for (; ;) {
            const currentIndex = members.indexOf(actor);
            actor = members[currentIndex + (forward ? 1 : -1)];
            if (!actor || actor.canInput()) {
                break;
            }
        }
        this._currentActor = actor ? actor : null;
        this.startActorInput();
    };

    static startActorInput() {
        if (this._currentActor) {
            this._currentActor.setActionState("inputting");
            this._inputting = true;
        }
    };

    static finishActorInput() {
        if (this._currentActor) {
            if (this.isTpb()) {
                this._currentActor.startTpbCasting();
            }
            this._currentActor.setActionState("waiting");
        }
    };

    static cancelActorInput() {
        if (this._currentActor) {
            this._currentActor.setActionState("undecided");
        }
    };

    static updateStart() {
        if (this.isTpb()) {
            this._phase = "turn";
        } else {
            this.startInput();
        }
    };

    static startTurn() {
        this._phase = "turn";
        window.$gameTroop.increaseTurn();
        window.$gameParty.requestMotionRefresh();
        if (!this.isTpb()) {
            this.makeActionOrders();
            this._logWindow.startTurn();
            this._inputting = false;
        }
    };

    static updateTurn(timeActive) {
        window.$gameParty.requestMotionRefresh();
        if (this.isTpb() && timeActive) {
            this.updateTpb();
        }
        if (!this._subject) {
            this._subject = this.getNextSubject();
        }
        if (this._subject) {
            this.processTurn();
        } else if (!this.isTpb()) {
            this.endTurn();
        }
    };

    static updateTpb() {
        window.$gameParty.updateTpb();
        window.$gameTroop.updateTpb();
        this.updateAllTpbBattlers();
        this.checkTpbTurnEnd();
    };

    static updateAllTpbBattlers() {
        for (const battler of this.allBattleMembers()) {
            this.updateTpbBattler(battler);
        }
    };

    static updateTpbBattler(battler) {
        if (battler.isTpbTurnEnd()) {
            battler.onTurnEnd();
            battler.startTpbTurn();
            this.displayBattlerStatus(battler, false);
        } else if (battler.isTpbReady()) {
            battler.startTpbAction();
            this._actionBattlers.push(battler);
        } else if (battler.isTpbTimeout()) {
            battler.onTpbTimeout();
            this.displayBattlerStatus(battler, true);
        }
    };

    static checkTpbTurnEnd() {
        if (window.$gameTroop.isTpbTurnEnd()) {
            this.endTurn();
        }
    };

    static processTurn() {
        const subject = this._subject;
        const action = subject.currentAction();
        if (action) {
            action.prepare();
            if (action.isValid()) {
                this.startAction();
            }
            subject.removeCurrentAction();
        } else {
            this.endAction();
            this._subject = null;
        }
    };

    static endBattlerActions(battler) {
        battler.setActionState(this.isTpb() ? "undecided" : "done");
        battler.onAllActionsEnd();
        battler.clearTpbChargeTime();
        this.displayBattlerStatus(battler, true);
    };

    static endTurn() {
        this._phase = "turnEnd";
        this._preemptive = false;
        this._surprise = false;
    }

    static updateTurnEnd() {
        if (this.isTpb()) {
            this.startTurn();
        } else {
            this.endAllBattlersTurn();
            this._phase = "start";
        }
    };

    static endAllBattlersTurn() {
        for (const battler of this.allBattleMembers()) {
            battler.onTurnEnd();
            this.displayBattlerStatus(battler, false);
        }
    };

    static displayBattlerStatus(battler, current) {
        this._logWindow.displayAutoAffectedStatus(battler);
        if (current) {
            this._logWindow.displayCurrentState(battler);
        }
        this._logWindow.displayRegeneration(battler);
    };

    static getNextSubject() {
        for (; ;) {
            const battler = this._actionBattlers.shift();
            if (!battler) {
                return null;
            }
            if (battler.isBattleMember() && battler.isAlive()) {
                return battler;
            }
        }
    };

    static allBattleMembers() {
        return window.$gameParty.battleMembers().concat(window.$gameTroop.members());
    };

    static makeActionOrders() {
        const battlers = [];
        if (!this._surprise) {
            battlers.push(...window.$gameParty.battleMembers());
        }
        if (!this._preemptive) {
            battlers.push(...window.$gameTroop.members());
        }
        for (const battler of battlers) {
            battler.makeSpeed();
        }
        battlers.sort((a, b) => b.speed() - a.speed());
        this._actionBattlers = battlers;
    };

    static startAction() {
        const subject = this._subject;
        const action = subject.currentAction();
        const targets = action.makeTargets();
        this._phase = "action";
        this._action = action;
        this._targets = targets;
        subject.cancelMotionRefresh();
        subject.useItem(action.item());
        this._action.applyGlobal();
        this._logWindow.startAction(subject, action, targets);
    };

    static updateAction() {
        const target = this._targets.shift();
        if (target) {
            this.invokeAction(this._subject, target);
        } else {
            this.endAction();
        }
    };

    static endAction() {
        this._logWindow.endAction(this._subject);
        this._phase = "turn";
        if (this._subject.numActions() === 0) {
            this.endBattlerActions(this._subject);
            this._subject = null;
        }
    };

    static invokeAction(subject, target) {
        this._logWindow.push("pushBaseLine");
        if (Math.random() < this._action.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        } else if (Math.random() < this._action.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        } else {
            this.invokeNormalAction(subject, target);
        }
        subject.setLastTarget(target);
        this._logWindow.push("popBaseLine");
    };

    static invokeNormalAction(subject, target) {
        const realTarget = this.applySubstitute(target);
        this._action.apply(realTarget);
        this._logWindow.displayActionResults(subject, realTarget);
    };

    static invokeCounterAttack(subject, target) {
        const action = new Game_Action(target);
        action.setAttack();
        action.apply(subject);
        this._logWindow.displayCounter(target);
        this._logWindow.displayActionResults(target, subject);
    };

    static invokeMagicReflection(subject, target) {
        this._action._reflectionTarget = target;
        this._logWindow.displayReflection(target);
        this._action.apply(subject);
        this._logWindow.displayActionResults(target, subject);
    };

    static applySubstitute(target) {
        if (this.checkSubstitute(target)) {
            const substitute = target.friendsUnit().substituteBattler();
            if (substitute && target !== substitute) {
                this._logWindow.displaySubstitute(substitute, target);
                return substitute;
            }
        }
        return target;
    };

    static checkSubstitute(target) {
        return target.isDying() && !this._action.isCertainHit();
    };

    static isActionForced() {
        return !!this._actionForcedBattler;
    };

    static forceAction(battler) {
        this._actionForcedBattler = battler;
        this._actionBattlers.remove(battler);
    };

    static processForcedAction() {
        if (this._actionForcedBattler) {
            if (this._subject) {
                this.endBattlerActions(this._subject);
            }
            this._subject = this._actionForcedBattler;
            this._actionForcedBattler = null;
            this.startAction();
            this._subject.removeCurrentAction();
        }
    };

    static abort() {
        this._phase = "aborting";
    };

    static checkBattleEnd() {
        if (this._phase) {
            if (window.$gameParty.isEscaped()) {
                this.processPartyEscape();
                return true;
            } else if (window.$gameParty.isAllDead()) {
                this.processDefeat();
                return true;
            } else if (window.$gameTroop.isAllDead()) {
                this.processVictory();
                return true;
            }
        }
        return false;
    };

    static checkAbort() {
        if (this.isAborting()) {
            this.processAbort();
            return true;
        }
        return false;
    };

    static processVictory() {
        window.$gameParty.removeBattleStates();
        window.$gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        this.displayVictoryMessage();
        this.displayRewards();
        this.gainRewards();
        this.endBattle(0);
    };

    static processEscape() {
        window.$gameParty.performEscape();
        SoundManager.playEscape();
        const success = this._preemptive || Math.random() < this._escapeRatio;
        if (success) {
            this.onEscapeSuccess();
        } else {
            this.onEscapeFailure();
        }
        return success;
    };

    static onEscapeSuccess() {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    };

    static onEscapeFailure() {
        window.$gameParty.onEscapeFailure();
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        if (!this.isTpb()) {
            this.startTurn();
        }
    };

    static processPartyEscape() {
        this._escaped = true;
        this.processAbort();
    };

    static processAbort() {
        window.$gameParty.removeBattleStates();
        this._logWindow.clear();
        this.replayBgmAndBgs();
        this.endBattle(1);
    };

    static processDefeat() {
        this.displayDefeatMessage();
        this.playDefeatMe();
        if (this._canLose) {
            this.replayBgmAndBgs();
        } else {
            AudioManager.stopBgm();
        }
        this.endBattle(2);
    };

    static endBattle(result) {
        this._phase = "battleEnd";
        this.cancelActorInput();
        this._inputting = false;
        if (this._eventCallback) {
            this._eventCallback(result);
        }
        if (result === 0) {
            window.$gameSystem.onBattleWin();
        } else if (this._escaped) {
            window.$gameSystem.onBattleEscape();
        }
        window.$gameTemp.clearCommonEventReservation();
    };

    static updateBattleEnd() {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if (!this._escaped && window.$gameParty.isAllDead()) {
            if (this._canLose) {
                window.$gameParty.reviveBattleMembers();
                SceneManager.pop();
            } else {
                SceneManager.goto(Scene_Gameover);
            }
        } else {
            SceneManager.pop();
        }
        this._phase = "";
    };

    static makeRewards() {
        this._rewards = {
            gold: window.$gameTroop.goldTotal(),
            exp: window.$gameTroop.expTotal(),
            items: window.$gameTroop.makeDropItems()
        };
    };

    static displayVictoryMessage() {
        window.$gameMessage.add(TextManager.victory.format(window.$gameParty.name()));
    };

    static displayDefeatMessage() {
        window.$gameMessage.add(TextManager.defeat.format(window.$gameParty.name()));
    };

    static displayEscapeSuccessMessage() {
        window.$gameMessage.add(TextManager.escapeStart.format(window.$gameParty.name()));
    };

    static displayEscapeFailureMessage() {
        window.$gameMessage.add(TextManager.escapeStart.format(window.$gameParty.name()));
        window.$gameMessage.add("\\." + TextManager.escapeFailure);
    };

    static displayRewards() {
        this.displayExp();
        this.displayGold();
        this.displayDropItems();
    };

    static displayExp() {
        const exp = this._rewards.exp;
        if (exp > 0) {
            const text = TextManager.obtainExp.format(exp, TextManager.exp);
            window.$gameMessage.add("\\." + text);
        }
    };

    static displayGold() {
        const gold = this._rewards.gold;
        if (gold > 0) {
            window.$gameMessage.add("\\." + TextManager.obtainGold.format(gold));
        }
    };

    static displayDropItems() {
        const items = this._rewards.items;
        if (items.length > 0) {
            window.$gameMessage.newPage();
            for (const item of items) {
                window.$gameMessage.add(TextManager.obtainItem.format(item.name));
            }
        }
    };

    static gainRewards() {
        this.gainExp();
        this.gainGold();
        this.gainDropItems();
    };

    static gainExp() {
        const exp = this._rewards.exp;
        for (const actor of window.$gameParty.allMembers()) {
            actor.gainExp(exp);
        }
    };

    static gainGold() {
        window.$gameParty.gainGold(this._rewards.gold);
    };

    static gainDropItems() {
        const items = this._rewards.items;
        for (const item of items) {
            window.$gameParty.gainItem(item, 1);
        }
    };
}
