import { Spriteset_Battle } from "../Spriteset/index.js";
import { Input, Rectangle, TouchInput } from "../Core/index.js";
import { SoundManager, DataManager, TextManager } from "../Manager/index.js";
import { Window_Base } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_BattleLog
 * 
 * The window for displaying battle progress. No frame is displayed, but it is
 * handled as a window for convenience.
*/
export class Window_BattleLog extends Window_Base {
    _lines: string[];
    _methods: { name: string; params: string[] }[];
    _waitCount: number;
    _waitMode: string;
    _baseLineStack: number[];
    _spriteset: Nullable<Spriteset_Battle>;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0;
        this._lines = [];
        this._methods = [];
        this._waitCount = 0;
        this._waitMode = "";
        this._baseLineStack = [];
        this._spriteset = null;
        this.refresh();
    };

    public setSpriteset(spriteset) {
        this._spriteset = spriteset;
    };

    public maxLines() {
        return 10;
    };

    public numLines() {
        return this._lines.length;
    };

    public messageSpeed() {
        return 16;
    };

    public isBusy() {
        return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
    };

    public update() {
        if (!this.updateWait()) {
            this.callNextMethod();
        }
    };

    public updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    };

    public updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount -= this.isFastForward() ? 3 : 1;
            if (this._waitCount < 0) {
                this._waitCount = 0;
            }
            return true;
        }
        return false;
    };

    public updateWaitMode() {
        let waiting = false;
        switch (this._waitMode) {
            case "effect":
                waiting = this._spriteset.isEffecting();
                break;
            case "movement":
                waiting = this._spriteset.isAnyoneMoving();
                break;
        }
        if (!waiting) {
            this._waitMode = "";
        }
        return waiting;
    };

    public setWaitMode(waitMode) {
        this._waitMode = waitMode;
    };

    public callNextMethod() {
        if (this._methods.length > 0) {
            const method = this._methods.shift();
            if (method.name && this[method.name]) {
                this[method.name].apply(this, method.params);
            } else {
                throw new Error("Method not found: " + method.name);
            }
        }
    };

    public isFastForward() {
        return (
            Input.isLongPressed("ok") ||
            Input.isPressed("shift") ||
            TouchInput.isLongPressed()
        );
    };

    public push(methodName, ...args: string[]) {
        const methodArgs: string[] = Array.prototype.slice.call(arguments, 1);
        this._methods.push({ name: methodName, params: methodArgs });
    };

    public clear() {
        this._lines = [];
        this._baseLineStack = [];
        this.refresh();
    };

    public wait() {
        this._waitCount = this.messageSpeed();
    };

    public waitForEffect() {
        this.setWaitMode("effect");
    };

    public waitForMovement() {
        this.setWaitMode("movement");
    };

    public addText(text) {
        this._lines.push(text);
        this.refresh();
        this.wait();
    };

    public pushBaseLine() {
        this._baseLineStack.push(this._lines.length);
    };

    public popBaseLine() {
        const baseLine = this._baseLineStack.pop();
        while (this._lines.length > baseLine) {
            this._lines.pop();
        }
    };

    public waitForNewLine() {
        let baseLine = 0;
        if (this._baseLineStack.length > 0) {
            baseLine = this._baseLineStack[this._baseLineStack.length - 1];
        }
        if (this._lines.length > baseLine) {
            this.wait();
        }
    };

    public popupDamage(target) {
        if (target.shouldPopupDamage()) {
            target.startDamagePopup();
        }
    };

    public performActionStart(subject, action) {
        subject.performActionStart(action);
    };

    public performAction(subject, action) {
        subject.performAction(action);
    };

    public performActionEnd(subject) {
        subject.performActionEnd();
    };

    public performDamage(target) {
        target.performDamage();
    };

    public performMiss(target) {
        target.performMiss();
    };

    public performRecovery(target) {
        target.performRecovery();
    };

    public performEvasion(target) {
        target.performEvasion();
    };

    public performMagicEvasion(target) {
        target.performMagicEvasion();
    };

    public performCounter(target) {
        target.performCounter();
    };

    public performReflection(target) {
        target.performReflection();
    };

    public performSubstitute(substitute, target) {
        substitute.performSubstitute(target);
    };

    public performCollapse(target) {
        target.performCollapse();
    };


    public showAnimation(
        subject, targets, animationId
    ) {
        if (animationId < 0) {
            this.showAttackAnimation(subject, targets);
        } else {
            this.showNormalAnimation(targets, animationId);
        }
    };

    public showAttackAnimation(subject, targets) {
        if (subject.isActor()) {
            this.showActorAttackAnimation(subject, targets);
        } else {
            this.showEnemyAttackAnimation(subject, targets);
        }
    };


    public showActorAttackAnimation(
        subject, targets
    ) {
        this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
        this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
    };


    public showEnemyAttackAnimation(subject?, targets?) {
        SoundManager.playEnemyAttack();
    };


    public showNormalAnimation(targets, animationId, mirror?) {
        const animation = window.$dataAnimations[animationId];
        if (animation) {
            window.$gameTemp.requestAnimation(targets, animationId, mirror);
        }
    };

    public refresh() {
        this.drawBackground();
        this.contents.clear();
        for (let i = 0; i < this._lines.length; i++) {
            this.drawLineText(i);
        }
    };

    public drawBackground() {
        const rect = this.backRect();
        const color = this.backColor();
        this.contentsBack.clear();
        this.contentsBack.paintOpacity = this.backPaintOpacity();
        this.contentsBack.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contentsBack.paintOpacity = 255;
    };

    public backRect() {
        const height = this.numLines() * this.itemHeight();
        return new Rectangle(0, 0, this.innerWidth, height);
    };

    public lineRect(index) {
        const itemHeight = this.itemHeight();
        const padding = this.itemPadding();
        const x = padding;
        const y = index * itemHeight;
        const width = this.innerWidth - padding * 2;
        const height = itemHeight;
        return new Rectangle(x, y, width, height);
    };

    public backColor() {
        return "#000000";
    };

    public backPaintOpacity() {
        return 64;
    };

    public drawLineText(index) {
        const rect = this.lineRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
    };

    public startTurn() {
        this.push("wait");
    };

    public startAction(subject, action, targets) {
        const item = action.item();
        this.push("performActionStart", subject, action);
        this.push("waitForMovement");
        this.push("performAction", subject, action);
        this.push("showAnimation", subject, targets.clone(), item.animationId);
        this.displayAction(subject, item);
    };

    public endAction(subject) {
        this.push("waitForNewLine");
        this.push("clear");
        this.push("performActionEnd", subject);
    };

    public displayCurrentState(subject) {
        const stateText = subject.mostImportantStateText();
        if (stateText) {
            this.push("addText", stateText.format(subject.name()));
            this.push("wait");
            this.push("clear");
        }
    };

    public displayRegeneration(subject) {
        this.push("popupDamage", subject);
    };

    public displayAction(subject, item) {
        const numMethods = this._methods.length;
        if (DataManager.isSkill(item)) {
            this.displayItemMessage(item.message1, subject, item);
            this.displayItemMessage(item.message2, subject, item);
        } else {
            this.displayItemMessage(TextManager.useItem, subject, item);
        }
        if (this._methods.length === numMethods) {
            this.push("wait");
        }
    };

    public displayItemMessage(fmt, subject, item) {
        if (fmt) {
            this.push("addText", fmt.format(subject.name(), item.name));
        }
    };

    public displayCounter(target) {
        this.push("performCounter", target);
        this.push("addText", TextManager.counterAttack.format(target.name()));
    };

    public displayReflection(target) {
        this.push("performReflection", target);
        this.push("addText", TextManager.magicReflection.format(target.name()));
    };

    public displaySubstitute(substitute, target) {
        const substName = substitute.name();
        const text = TextManager.substitute.format(substName, target.name());
        this.push("performSubstitute", substitute, target);
        this.push("addText", text);
    };

    public displayActionResults(subject, target) {
        if (target.result().used) {
            this.push("pushBaseLine");
            this.displayCritical(target);
            this.push("popupDamage", target);
            this.push("popupDamage", subject);
            this.displayDamage(target);
            this.displayAffectedStatus(target);
            this.displayFailure(target);
            this.push("waitForNewLine");
            this.push("popBaseLine");
        }
    };

    public displayFailure(target) {
        if (target.result().isHit() && !target.result().success) {
            this.push("addText", TextManager.actionFailure.format(target.name()));
        }
    };

    public displayCritical(target) {
        if (target.result().critical) {
            if (target.isActor()) {
                this.push("addText", TextManager.criticalToActor);
            } else {
                this.push("addText", TextManager.criticalToEnemy);
            }
        }
    };

    public displayDamage(target) {
        if (target.result().missed) {
            this.displayMiss(target);
        } else if (target.result().evaded) {
            this.displayEvasion(target);
        } else {
            this.displayHpDamage(target);
            this.displayMpDamage(target);
            this.displayTpDamage(target);
        }
    };

    public displayMiss(target) {
        let fmt;
        if (target.result().physical) {
            const isActor = target.isActor();
            fmt = isActor ? TextManager.actorNoHit : TextManager.enemyNoHit;
            this.push("performMiss", target);
        } else {
            fmt = TextManager.actionFailure;
        }
        this.push("addText", fmt.format(target.name()));
    };

    public displayEvasion(target) {
        let fmt;
        if (target.result().physical) {
            fmt = TextManager.evasion;
            this.push("performEvasion", target);
        } else {
            fmt = TextManager.magicEvasion;
            this.push("performMagicEvasion", target);
        }
        this.push("addText", fmt.format(target.name()));
    };

    public displayHpDamage(target) {
        if (target.result().hpAffected) {
            if (target.result().hpDamage > 0 && !target.result().drain) {
                this.push("performDamage", target);
            }
            if (target.result().hpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeHpDamageText(target));
        }
    };

    public displayMpDamage(target) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeMpDamageText(target));
        }
    };

    public displayTpDamage(target) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeTpDamageText(target));
        }
    };

    public displayAffectedStatus(target, ...args: any[]) {
        if (target.result().isStatusAffected()) {
            this.push("pushBaseLine");
            this.displayChangedStates(target);
            this.displayChangedBuffs(target);
            this.push("waitForNewLine");
            this.push("popBaseLine");
        }
    };

    public displayAutoAffectedStatus(target) {
        if (target.result().isStatusAffected()) {
            this.displayAffectedStatus(target, null);
            this.push("clear");
        }
    };

    public displayChangedStates(target) {
        this.displayAddedStates(target);
        this.displayRemovedStates(target);
    };

    public displayAddedStates(target) {
        const result = target.result();
        const states = result.addedStateObjects();
        for (const state of states) {
            const stateText = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push("performCollapse", target);
            }
            if (stateText) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", stateText.format(target.name()));
                this.push("waitForEffect");
            }
        }
    };

    public displayRemovedStates(target) {
        const result = target.result();
        const states = result.removedStateObjects();
        for (const state of states) {
            if (state.message4) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", state.message4.format(target.name()));
            }
        }
    };

    public displayChangedBuffs(target) {
        const result = target.result();
        this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
    };

    public displayBuffs(target, buffs, fmt) {
        for (const paramId of buffs) {
            const text = fmt.format(target.name(), TextManager.param(paramId));
            this.push("popBaseLine");
            this.push("pushBaseLine");
            this.push("addText", text);
        }
    };

    public makeHpDamageText(target) {
        const result = target.result();
        const damage = result.hpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.hp, damage);
        } else if (damage > 0) {
            fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
            return fmt.format(target.name(), damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.hp, -damage);
        } else {
            fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
            return fmt.format(target.name());
        }
    };

    public makeMpDamageText(target) {
        const result = target.result();
        const damage = result.mpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.mp, damage);
        } else if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.mp, damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.mp, -damage);
        } else {
            return "";
        }
    };

    public makeTpDamageText(target) {
        const result = target.result();
        const damage = result.tpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.tp, damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
            return fmt.format(target.name(), TextManager.tp, -damage);
        } else {
            return "";
        }
    };

}

