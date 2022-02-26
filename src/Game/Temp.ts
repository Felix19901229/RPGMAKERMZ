import { Utils } from "../Core/index.js";
import { Game_Actor, Game_Battler, Game_Enemy } from "./index.js";

type target = Game_Battler | Game_Actor | Game_Enemy;
type AnimationQueue = {
    targets: target[];
    animationId: number;
    mirror: boolean;
}
type BalloonQueue = {
    target: target;
    balloonId: number;
}
//-----------------------------------------------------------------------------
/**
 * Game_Temp
 * 
 * The game object class for temporary data that is not included in save data.
*/
export class Game_Temp {
    _isPlaytest: boolean;
    _destinationX: Nullable<number>;
    _destinationY: Nullable<number>;
    _touchTarget: target;
    _touchState: string;
    _needsBattleRefresh: boolean;
    _commonEventQueue: number[];
    _animationQueue: AnimationQueue[];
    _balloonQueue: BalloonQueue[];
    _lastActionData: number[];
    constructor(...args: any[]) {
        this.initialize(...args);
    }

    public initialize(...args: any[]) {
        this._isPlaytest = Utils.isOptionValid("test");
        this._destinationX = null;
        this._destinationY = null;
        this._touchTarget = null;
        this._touchState = "";
        this._needsBattleRefresh = false;
        this._commonEventQueue = [];
        this._animationQueue = [];
        this._balloonQueue = [];
        this._lastActionData = [0, 0, 0, 0, 0, 0];
    }

    public isPlaytest() {
        return this._isPlaytest;
    }

    public setDestination(x, y) {
        this._destinationX = x;
        this._destinationY = y;
    }

    public clearDestination() {
        this._destinationX = null;
        this._destinationY = null;
    }

    public isDestinationValid() {
        return this._destinationX !== null;
    }

    public destinationX() {
        return this._destinationX;
    }

    public destinationY() {
        return this._destinationY;
    }

    public setTouchState(target, state) {
        this._touchTarget = target;
        this._touchState = state;
    }

    public clearTouchState() {
        this._touchTarget = null;
        this._touchState = "";
    }

    public touchTarget() {
        return this._touchTarget;
    }

    public touchState() {
        return this._touchState;
    }

    public requestBattleRefresh() {
        if (window.$gameParty.inBattle()) {
            this._needsBattleRefresh = true;
        }
    }

    public clearBattleRefreshRequest() {
        this._needsBattleRefresh = false;
    }

    public isBattleRefreshRequested() {
        return this._needsBattleRefresh;
    }

    public reserveCommonEvent(commonEventId) {
        this._commonEventQueue.push(commonEventId);
    }

    public retrieveCommonEvent() {
        return window.$dataCommonEvents[this._commonEventQueue.shift()];
    }

    public clearCommonEventReservation() {
        this._commonEventQueue.length = 0;
    };

    public isCommonEventReserved() {
        return this._commonEventQueue.length > 0;
    }

    public requestAnimation(targets, animationId, mirror: boolean = false) {
        if (window.$dataAnimations[animationId]) {
            const request = {
                targets: targets,
                animationId: animationId,
                mirror: mirror
            }
            this._animationQueue.push(request);
            for (const target of targets) {
                if (target.startAnimation) {
                    target.startAnimation();
                }
            }
        }
    }

    public retrieveAnimation() {
        return this._animationQueue.shift();
    }

    public requestBalloon(target, balloonId) {
        const request = { target: target, balloonId: balloonId }
        this._balloonQueue.push(request);
        if (target.startBalloon) {
            target.startBalloon();
        }
    }

    public retrieveBalloon() {
        return this._balloonQueue.shift();
    }

    public lastActionData(type) {
        return this._lastActionData[type] || 0;
    }

    public setLastActionData(type, value) {
        this._lastActionData[type] = value;
    }

    public setLastUsedSkillId(skillID) {
        this.setLastActionData(0, skillID);
    }

    public setLastUsedItemId(itemID) {
        this.setLastActionData(1, itemID);
    }

    public setLastSubjectActorId(actorID) {
        this.setLastActionData(2, actorID);
    }

    public setLastSubjectEnemyIndex(enemyIndex) {
        this.setLastActionData(3, enemyIndex);
    }

    public setLastTargetActorId(actorID) {
        this.setLastActionData(4, actorID);
    }

    public setLastTargetEnemyIndex(enemyIndex) {
        this.setLastActionData(5, enemyIndex);
    }
}
