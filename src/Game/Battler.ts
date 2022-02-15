import { BattleManager, DataManager, SoundManager } from "../Manager/index.js";
import { Game_Action, Game_ActionResult, Game_BattlerBase } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Game_Battler
 * 
 * The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
 * and actions.
*/
export class Game_Battler extends Game_BattlerBase {
    _actions: Game_Action[];
    _result: Game_ActionResult;
    _speed: number;
    _actionState: string;
    _lastTargetIndex: number;
    _damagePopup: boolean;
    _effectType: null;
    _motionRefresh: boolean;
    _weaponImageId: number;
    _motionType: null;
    _selected: boolean;
    _tpbChargeTime: number;
    _tpbState: string;
    _tpbCastTime: number;
    _tpbIdleTime: number;
    _tpbTurnCount: number;
    _tpbTurnEnd: boolean;
    constructor(...args:[number,number?,number?]) {
        super(...args)
        this.initialize(...args);
    }
    public initialize(...args) {
        super.initialize();
    };
    public initMembers() {
        Game_BattlerBase.prototype.initMembers.call(this);
        this._actions = [];
        this._speed = 0;
        this._result = new Game_ActionResult();
        this._actionState = "";
        this._lastTargetIndex = 0;
        this._damagePopup = false;
        this._effectType = null;
        this._motionType = null;
        this._weaponImageId = 0;
        this._motionRefresh = false;
        this._selected = false;
        this._tpbState = "";
        this._tpbChargeTime = 0;
        this._tpbCastTime = 0;
        this._tpbIdleTime = 0;
        this._tpbTurnCount = 0;
        this._tpbTurnEnd = false;
    };
    public clearDamagePopup() {
        this._damagePopup = false;
    };
    public clearWeaponAnimation() {
        this._weaponImageId = 0;
    };
    public clearEffect() {
        this._effectType = null;
    };
    public clearMotion() {
        this._motionType = null;
        this._motionRefresh = false;
    };
    public requestEffect(effectType) {
        this._effectType = effectType;
    };
    public requestMotion(motionType) {
        this._motionType = motionType;
    };
    public requestMotionRefresh() {
        this._motionRefresh = true;
    };
    public select() {
        this._selected = true;
    };
    public deselect() {
        this._selected = false;
    };
    public isDamagePopupRequested() {
        return this._damagePopup;
    };
    public isEffectRequested() {
        return !!this._effectType;
    };
    public isMotionRequested() {
        return !!this._motionType;
    };
    public isWeaponAnimationRequested() {
        return this._weaponImageId > 0;
    };
    public isMotionRefreshRequested() {
        return this._motionRefresh;
    };
    public isSelected() {
        return this._selected;
    };
    public effectType() {
        return this._effectType;
    };
    public motionType() {
        return this._motionType;
    };
    public weaponImageId() {
        return this._weaponImageId;
    };
    public startDamagePopup() {
        this._damagePopup = true;
    };
    public shouldPopupDamage() {
        const result = this._result;
        return (
            result.missed ||
            result.evaded ||
            result.hpAffected ||
            result.mpDamage !== 0
        );
    };
    public startWeaponAnimation(weaponImageId) {
        this._weaponImageId = weaponImageId;
    };
    public action(index) {
        return this._actions[index];
    };
    public setAction(index, action) {
        this._actions[index] = action;
    };
    public numActions() {
        return this._actions.length;
    };
    public clearActions() {
        this._actions = [];
    };
    public result() {
        return this._result;
    };
    public clearResult() {
        this._result.clear();
    };
    public clearTpbChargeTime() {
        this._tpbState = "charging";
        this._tpbChargeTime = 0;
    };
    public applyTpbPenalty() {
        this._tpbState = "charging";
        this._tpbChargeTime -= 1;
    };
    public initTpbChargeTime(advantageous) {
        const speed = this.tpbRelativeSpeed();
        this._tpbState = "charging";
        this._tpbChargeTime = advantageous ? 1 : speed * Math.random() * 0.5;
        if (this.isRestricted()) {
            this._tpbChargeTime = 0;
        }
    };
    public tpbChargeTime() {
        return this._tpbChargeTime;
    };
    public startTpbCasting() {
        this._tpbState = "casting";
        this._tpbCastTime = 0;
    };
    public startTpbAction() {
        this._tpbState = "acting";
    };
    public isTpbCharged() {
        return this._tpbState === "charged";
    };
    public isTpbReady() {
        return this._tpbState === "ready";
    };
    public isTpbTimeout() {
        return this._tpbIdleTime >= 1;
    };
    public updateTpb() {
        if (this.canMove()) {
            this.updateTpbChargeTime();
            this.updateTpbCastTime();
            this.updateTpbAutoBattle();
        }
        if (this.isAlive()) {
            this.updateTpbIdleTime();
        }
    };
    public updateTpbChargeTime() {
        if (this._tpbState === "charging") {
            this._tpbChargeTime += this.tpbAcceleration();
            if (this._tpbChargeTime >= 1) {
                this._tpbChargeTime = 1;
                this.onTpbCharged();
            }
        }
    };
    public updateTpbCastTime() {
        if (this._tpbState === "casting") {
            this._tpbCastTime += this.tpbAcceleration();
            if (this._tpbCastTime >= this.tpbRequiredCastTime()) {
                this._tpbCastTime = this.tpbRequiredCastTime();
                this._tpbState = "ready";
            }
        }
    };
    public updateTpbAutoBattle() {
        if (this.isTpbCharged() && !this.isTpbTurnEnd() && this.isAutoBattle()) {
            this.makeTpbActions();
        }
    };
    public updateTpbIdleTime() {
        if (!this.canMove() || this.isTpbCharged()) {
            this._tpbIdleTime += this.tpbAcceleration();
        }
    };
    public tpbAcceleration() {
        const speed = this.tpbRelativeSpeed();
        const referenceTime = $gameParty.tpbReferenceTime();
        return speed / referenceTime;
    };
    public tpbRelativeSpeed() {
        return this.tpbSpeed() / $gameParty.tpbBaseSpeed();
    };
    public tpbSpeed() {
        return Math.sqrt(this.agi) + 1;
    };
    public tpbBaseSpeed() {
        const baseAgility = this.paramBasePlus(6);
        return Math.sqrt(baseAgility) + 1;
    };
    public tpbRequiredCastTime() {
        const actions = this._actions.filter(action => action.isValid());
        const items = actions.map(action => action.item());
        const delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);
        return Math.sqrt(delay) / this.tpbSpeed();
    };
    public onTpbCharged() {
        if (!this.shouldDelayTpbCharge()) {
            this.finishTpbCharge();
        }
    };
    public shouldDelayTpbCharge() {
        return !BattleManager.isActiveTpb() && $gameParty.canInput();
    };
    public finishTpbCharge() {
        this._tpbState = "charged";
        this._tpbTurnEnd = true;
        this._tpbIdleTime = 0;
    };
    public isTpbTurnEnd() {
        return this._tpbTurnEnd;
    };
    public initTpbTurn() {
        this._tpbTurnEnd = false;
        this._tpbTurnCount = 0;
        this._tpbIdleTime = 0;
    };
    public startTpbTurn() {
        this._tpbTurnEnd = false;
        this._tpbTurnCount++;
        this._tpbIdleTime = 0;
        if (this.numActions() === 0) {
            this.makeTpbActions();
        }
    };
    public makeTpbActions() {
        this.makeActions();
        if (this.canInput()) {
            this.setActionState("undecided");
        } else {
            this.startTpbCasting();
            this.setActionState("waiting");
        }
    };
    public onTpbTimeout() {
        this.onAllActionsEnd();
        this._tpbTurnEnd = true;
        this._tpbIdleTime = 0;
    };
    public turnCount() {
        if (BattleManager.isTpb()) {
            return this._tpbTurnCount;
        } else {
            return $gameTroop.turnCount() + 1;
        }
    };
    public canInput() {
        if (BattleManager.isTpb() && !this.isTpbCharged()) {
            return false;
        }
        return Game_BattlerBase.prototype.canInput.call(this);
    };
    public refresh() {
        Game_BattlerBase.prototype.refresh.call(this);
        if (this.hp === 0) {
            this.addState(this.deathStateId());
        } else {
            this.removeState(this.deathStateId());
        }
    };
    public addState(stateId) {
        if (this.isStateAddable(stateId)) {
            if (!this.isStateAffected(stateId)) {
                this.addNewState(stateId);
                this.refresh();
            }
            this.resetStateCounts(stateId);
            this._result.pushAddedState(stateId);
        }
    };
    public isStateAddable(stateId) {
        return (
            this.isAlive() &&
            $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this.isStateRestrict(stateId)
        );
    };
    public isStateRestrict(stateId) {
        return $dataStates[stateId].removeByRestriction && this.isRestricted();
    };
    public onRestrict() {
        Game_BattlerBase.prototype.onRestrict.call(this);
        this.clearTpbChargeTime();
        this.clearActions();
        for (const state of this.states()) {
            if (state.removeByRestriction) {
                this.removeState(state.id);
            }
        }
    };
    public removeState(stateId) {
        if (this.isStateAffected(stateId)) {
            if (stateId === this.deathStateId()) {
                this.revive();
            }
            this.eraseState(stateId);
            this.refresh();
            this._result.pushRemovedState(stateId);
        }
    };
    public escape() {
        if ($gameParty.inBattle()) {
            this.hide();
        }
        this.clearActions();
        this.clearStates();
        SoundManager.playEscape();
    };
    public addBuff(paramId, turns) {
        if (this.isAlive()) {
            this.increaseBuff(paramId);
            if (this.isBuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedBuff(paramId);
            this.refresh();
        }
    };
    public addDebuff(paramId, turns) {
        if (this.isAlive()) {
            this.decreaseBuff(paramId);
            if (this.isDebuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedDebuff(paramId);
            this.refresh();
        }
    };
    public removeBuff(paramId) {
        if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
            this.eraseBuff(paramId);
            this._result.pushRemovedBuff(paramId);
            this.refresh();
        }
    };
    public removeBattleStates() {
        for (const state of this.states()) {
            if (state.removeAtBattleEnd) {
                this.removeState(state.id);
            }
        }
    };
    public removeAllBuffs() {
        for (let i = 0; i < this.buffLength(); i++) {
            this.removeBuff(i);
        }
    };
    public removeStatesAuto(timing) {
        for (const state of this.states()) {
            if (
                this.isStateExpired(state.id) &&
                state.autoRemovalTiming === timing
            ) {
                this.removeState(state.id);
            }
        }
    };
    public removeBuffsAuto() {
        for (let i = 0; i < this.buffLength(); i++) {
            if (this.isBuffExpired(i)) {
                this.removeBuff(i);
            }
        }
    };
    public removeStatesByDamage() {
        for (const state of this.states()) {
            if (
                state.removeByDamage &&
                Math.randomInt(100) < state.chanceByDamage
            ) {
                this.removeState(state.id);
            }
        }
    };
    public makeActionTimes() {
        const actionPlusSet = this.actionPlusSet();
        return actionPlusSet.reduce((r, p) => (Math.random() < p ? r + 1 : r), 1);
    };
    public makeActions() {
        this.clearActions();
        if (this.canMove()) {
            const actionTimes = this.makeActionTimes();
            this._actions = [];
            for (let i = 0; i < actionTimes; i++) {
                this._actions.push(new Game_Action(this));
            }
        }
    };
    public speed() {
        return this._speed;
    };
    public makeSpeed() {
        this._speed = Math.min(...this._actions.map(action => action.speed())) || 0;
    };
    public currentAction() {
        return this._actions[0];
    };
    public removeCurrentAction() {
        this._actions.shift();
    };
    public setLastTarget(target) {
        this._lastTargetIndex = target ? target.index() : 0;
    };
    public forceAction(skillId, targetIndex) {
        this.clearActions();
        const action = new Game_Action(this, true);
        action.setSkill(skillId);
        if (targetIndex === -2) {
            action.setTarget(this._lastTargetIndex);
        } else if (targetIndex === -1) {
            action.decideRandomTarget();
        } else {
            action.setTarget(targetIndex);
        }
        this._actions.push(action);
    };
    public useItem(item) {
        if (DataManager.isSkill(item)) {
            this.paySkillCost(item);
        } else if (DataManager.isItem(item)) {
            this.consumeItem(item);
        }
    };
    public consumeItem(item) {
        $gameParty.consumeItem(item);
    };
    public gainHp(value) {
        this._result.hpDamage = -value;
        this._result.hpAffected = true;
        this.setHp(this.hp + value);
    };
    public gainMp(value) {
        this._result.mpDamage = -value;
        this.setMp(this.mp + value);
    };
    public gainTp(value) {
        this._result.tpDamage = -value;
        this.setTp(this.tp + value);
    };
    public gainSilentTp(value) {
        this.setTp(this.tp + value);
    };
    public initTp() {
        this.setTp(Math.randomInt(25));
    };
    public clearTp() {
        this.setTp(0);
    };
    public chargeTpByDamage(damageRate) {
        const value = Math.floor(50 * damageRate * this.tcr);
        this.gainSilentTp(value);
    };
    public regenerateHp() {
        const minRecover = -this.maxSlipDamage();
        const value = Math.max(Math.floor(this.mhp * this.hrg), minRecover);
        if (value !== 0) {
            this.gainHp(value);
        }
    };
    public maxSlipDamage() {
        return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
    };
    public regenerateMp() {
        const value = Math.floor(this.mmp * this.mrg);
        if (value !== 0) {
            this.gainMp(value);
        }
    };
    public regenerateTp() {
        const value = Math.floor(100 * this.trg);
        this.gainSilentTp(value);
    };
    public regenerateAll() {
        if (this.isAlive()) {
            this.regenerateHp();
            this.regenerateMp();
            this.regenerateTp();
        }
    };
    public onBattleStart(advantageous) {
        this.setActionState("undecided");
        this.clearMotion();
        this.initTpbChargeTime(advantageous);
        this.initTpbTurn();
        if (!this.isPreserveTp()) {
            this.initTp();
        }
    };
    public onAllActionsEnd() {
        this.clearResult();
        this.removeStatesAuto(1);
        this.removeBuffsAuto();
    };
    public onTurnEnd() {
        this.clearResult();
        this.regenerateAll();
        this.updateStateTurns();
        this.updateBuffTurns();
        this.removeStatesAuto(2);
    };
    public onBattleEnd() {
        this.clearResult();
        this.removeBattleStates();
        this.removeAllBuffs();
        this.clearActions();
        if (!this.isPreserveTp()) {
            this.clearTp();
        }
        this.appear();
    };
    public onDamage(value) {
        this.removeStatesByDamage();
        this.chargeTpByDamage(value / this.mhp);
    };
    public setActionState(actionState) {
        this._actionState = actionState;
        this.requestMotionRefresh();
    };
    public isUndecided() {
        return this._actionState === "undecided";
    };
    public isInputting() {
        return this._actionState === "inputting";
    };
    public isWaiting() {
        return this._actionState === "waiting";
    };
    public isActing() {
        return this._actionState === "acting";
    };
    public isChanting() {
        if (this.isWaiting()) {
            return this._actions.some(action => action.isMagicSkill());
        }
        return false;
    };
    public isGuardWaiting() {
        if (this.isWaiting()) {
            return this._actions.some(action => action.isGuard());
        }
        return false;
    };
    public performActionStart(action) {
        if (!action.isGuard()) {
            this.setActionState("acting");
        }
    };
    public performAction(action) {
        //
    };
    public performActionEnd() {
        //
    };
    public performDamage() {
        //
    };
    public performMiss() {
        SoundManager.playMiss();
    };
    public performRecovery() {
        SoundManager.playRecovery();
    };
    public performEvasion() {
        SoundManager.playEvasion();
    };
    public performMagicEvasion() {
        SoundManager.playMagicEvasion();
    };
    public performCounter() {
        SoundManager.playEvasion();
    };
    public performReflection() {
        SoundManager.playReflection();
    };
    public performSubstitute(/*target*/) {
        //
    };
    public performCollapse() {
        //
    };
}
