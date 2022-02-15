import { SoundManager } from "../Manager/index.js";
import { Game_Battler } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Game_Enemy
 * 
 * The game object class for an enemy.
*/
export class Game_Enemy extends Game_Battler {
    _enemyId: number;
    _letter: string;
    _plural: boolean;
    _screenX: number;
    _screenY: number;
    constructor(enemyId, x, y) {
        super(enemyId, x, y);
        this.initialize(enemyId, x, y);
    }
    public initialize(enemyId, x, y) {
        Game_Battler.prototype.initialize.call(this);
        this.setup(enemyId, x, y);
    };
    public initMembers() {
        Game_Battler.prototype.initMembers.call(this);
        this._enemyId = 0;
        this._letter = "";
        this._plural = false;
        this._screenX = 0;
        this._screenY = 0;
    };
    public setup(enemyId, x, y) {
        this._enemyId = enemyId;
        this._screenX = x;
        this._screenY = y;
        this.recoverAll();
    };
    public isEnemy() {
        return true;
    };
    public friendsUnit() {
        return $gameTroop;
    };
    public opponentsUnit() {
        return $gameParty;
    };
    public index() {
        return $gameTroop.members().indexOf(this);
    };
    public isBattleMember() {
        return this.index() >= 0;
    };
    public enemyId() {
        return this._enemyId;
    };
    public enemy() {
        return $dataEnemies[this._enemyId];
    };
    public traitObjects() {
        return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
    };
    public paramBase(paramId) {
        return this.enemy().params[paramId];
    };
    public exp() {
        return this.enemy().exp;
    };
    public gold() {
        return this.enemy().gold;
    };
    public makeDropItems() {
        const rate = this.dropItemRate();
        return this.enemy().dropItems.reduce((r, di) => {
            if (di.kind > 0 && Math.random() * di.denominator < rate) {
                return r.concat(this.itemObject(di.kind, di.dataId));
            } else {
                return r;
            }
        }, []);
    };
    public dropItemRate() {
        return $gameParty.hasDropItemDouble() ? 2 : 1;
    };
    public itemObject(kind, dataId) {
        if (kind === 1) {
            return $dataItems[dataId];
        } else if (kind === 2) {
            return $dataWeapons[dataId];
        } else if (kind === 3) {
            return $dataArmors[dataId];
        } else {
            return null;
        }
    };
    public isSpriteVisible() {
        return true;
    };
    public screenX() {
        return this._screenX;
    };
    public screenY() {
        return this._screenY;
    };
    public battlerName() {
        return this.enemy().battlerName;
    };
    public battlerHue() {
        return this.enemy().battlerHue;
    };
    public originalName() {
        return this.enemy().name;
    };
    public name() {
        return this.originalName() + (this._plural ? this._letter : "");
    };
    public isLetterEmpty() {
        return this._letter === "";
    };
    public setLetter(letter) {
        this._letter = letter;
    };
    public setPlural(plural) {
        this._plural = plural;
    };
    public performActionStart(action) {
        Game_Battler.prototype.performActionStart.call(this, action);
        this.requestEffect("whiten");
    };
    public performAction(action) {
        Game_Battler.prototype.performAction.call(this, action);
    };
    public performActionEnd() {
        Game_Battler.prototype.performActionEnd.call(this);
    };
    public performDamage() {
        Game_Battler.prototype.performDamage.call(this);
        SoundManager.playEnemyDamage();
        this.requestEffect("blink");
    };
    public performCollapse() {
        Game_Battler.prototype.performCollapse.call(this);
        switch (this.collapseType()) {
            case 0:
                this.requestEffect("collapse");
                SoundManager.playEnemyCollapse();
                break;
            case 1:
                this.requestEffect("bossCollapse");
                SoundManager.playBossCollapse1();
                break;
            case 2:
                this.requestEffect("instantCollapse");
                break;
        }
    };
    public transform(enemyId) {
        const name = this.originalName();
        this._enemyId = enemyId;
        if (this.originalName() !== name) {
            this._letter = "";
            this._plural = false;
        }
        this.refresh();
        if (this.numActions() > 0) {
            this.makeActions();
        }
    };
    public meetsCondition(action) {
        const param1 = action.conditionParam1;
        const param2 = action.conditionParam2;
        switch (action.conditionType) {
            case 1:
                return this.meetsTurnCondition(param1, param2);
            case 2:
                return this.meetsHpCondition(param1, param2);
            case 3:
                return this.meetsMpCondition(param1, param2);
            case 4:
                return this.meetsStateCondition(param1);
            case 5:
                return this.meetsPartyLevelCondition(param1);
            case 6:
                return this.meetsSwitchCondition(param1);
            default:
                return true;
        }
    };
    public meetsTurnCondition(param1, param2) {
        const n = this.turnCount();
        if (param2 === 0) {
            return n === param1;
        } else {
            return n > 0 && n >= param1 && n % param2 === param1 % param2;
        }
    };
    public meetsHpCondition(param1, param2) {
        return this.hpRate() >= param1 && this.hpRate() <= param2;
    };
    public meetsMpCondition(param1, param2) {
        return this.mpRate() >= param1 && this.mpRate() <= param2;
    };
    public meetsStateCondition(param) {
        return this.isStateAffected(param);
    };
    public meetsPartyLevelCondition(param) {
        return $gameParty.highestLevel() >= param;
    };
    public meetsSwitchCondition(param) {
        return $gameSwitches.value(param);
    };
    public isActionValid(action) {
        return (
            this.meetsCondition(action) && this.canUse($dataSkills[action.skillId])
        );
    };
    public selectAction(actionList, ratingZero) {
        const sum = actionList.reduce((r, a) => r + a.rating - ratingZero, 0);
        if (sum > 0) {
            let value = Math.randomInt(sum);
            for (const action of actionList) {
                value -= action.rating - ratingZero;
                if (value < 0) {
                    return action;
                }
            }
        } else {
            return null;
        }
    };
    public selectAllActions(actionList) {
        const ratingMax = Math.max(...actionList.map(a => a.rating));
        const ratingZero = ratingMax - 3;
        actionList = actionList.filter(a => a.rating > ratingZero);
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setEnemyAction(
                this.selectAction(actionList, ratingZero)
            );
        }
    };
    public makeActions() {
        Game_Battler.prototype.makeActions.call(this);
        if (this.numActions() > 0) {
            const actionList = this.enemy().actions.filter(a =>
                this.isActionValid(a)
            );
            if (actionList.length > 0) {
                this.selectAllActions(actionList);
            }
        }
        this.setActionState("waiting");
    };

}
