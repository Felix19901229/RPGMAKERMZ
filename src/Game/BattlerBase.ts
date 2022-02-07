import { DataManager } from "../Manager/Data.js";
//-----------------------------------------------------------------------------
/**
 * Game_BattlerBase 
 * 
 * The superclass of Game_Battler. It mainly contains parameters calculation.
*/
export class Game_BattlerBase {
    static TRAIT_ELEMENT_RATE = 11;
    static TRAIT_DEBUFF_RATE = 12;
    static TRAIT_STATE_RATE = 13;
    static TRAIT_STATE_RESIST = 14;
    static TRAIT_PARAM = 21;
    static TRAIT_XPARAM = 22;
    static TRAIT_SPARAM = 23;
    static TRAIT_ATTACK_ELEMENT = 31;
    static TRAIT_ATTACK_STATE = 32;
    static TRAIT_ATTACK_SPEED = 33;
    static TRAIT_ATTACK_TIMES = 34;
    static TRAIT_ATTACK_SKILL = 35;
    static TRAIT_STYPE_ADD = 41;
    static TRAIT_STYPE_SEAL = 42;
    static TRAIT_SKILL_ADD = 43;
    static TRAIT_SKILL_SEAL = 44;
    static TRAIT_EQUIP_WTYPE = 51;
    static TRAIT_EQUIP_ATYPE = 52;
    static TRAIT_EQUIP_LOCK = 53;
    static TRAIT_EQUIP_SEAL = 54;
    static TRAIT_SLOT_TYPE = 55;
    static TRAIT_ACTION_PLUS = 61;
    static TRAIT_SPECIAL_FLAG = 62;
    static TRAIT_COLLAPSE_TYPE = 63;
    static TRAIT_PARTY_ABILITY = 64;
    static FLAG_ID_AUTO_BATTLE = 0;
    static FLAG_ID_GUARD = 1;
    static FLAG_ID_SUBSTITUTE = 2;
    static FLAG_ID_PRESERVE_TP = 3;
    static ICON_BUFF_START = 32;
    static ICON_DEBUFF_START = 48;
    _hp: number;
    _mp: number;
    _hidden: boolean;
    _tp: number;
    _paramPlus: number[];
    _states: number[];
    _stateTurns: AnyObject<number>;
    _buffs: number[];
    _buffTurns: number[];
    /**
     * Hit Points
    */
    public get hp() {
        return this._hp;
    }
    /**
     * Magic Points
    */
    public get mp() {
        return this._mp;
    }
    /**
     * Tactical Points
    */
    public get tp() {
        return this._tp;
    }
    /**
     * Maximum Hit Points
    */
    public get mhp() {
        return this.param(0);
    }
    /**
     * Maximum Magic Points
    */
    public get mmp() {
        return this.param(1);
    }
    /**
     * ATtacK power
    */
    public get atk() {
        return this.param(2);
    }
    /**
     * DEFense power
    */
    public get def() {
        return this.param(3);
    }
    /**
     * Magic ATtack power
    */
    public get mat() {
        return this.param(4);
    }
    /**
     * Magic DeFense power
    */
    public get mdf() {
        return this.param(5);
    }
    /**
     * AGIlity
    */
    public get agi() {
        return this.param(6);
    }
    /**
     * LUcK
    */
    public get luk() {
        return this.param(7);
    }
    /**
     * HIT rate
    */
    public get hit() {
        return this.xparam(0);
    }
    /**
     * EVAsion rate
    */
    public get eva() {
        return this.xparam(1);
    }
    /**
     * CRItical rate
    */
    public get cri() {
        return this.xparam(2);
    }
    /**
     * Critical EVasion rate
    */
    public get cev() {
        return this.xparam(3);
    }
    /**
     * Magic EVasion rate
    */
    public get mev() {
        return this.xparam(4);
    }
    /**
     * Magic ReFlection rate
    */
    public get mrf() {
        return this.xparam(5);
    }
    /**
     * CouNTer attack rate
    */
    public get cnt() {
        return this.xparam(6);
    }
    /**
     * Hp ReGeneration rate
    */
    public get hrg() {
        return this.xparam(7);
    }
    /**
     * Mp ReGeneration rate
    */
    public get mrg() {
        return this.xparam(8);
    }
    /**
     * Tp ReGeneration rate
    */
    public get trg() {
        return this.xparam(9);
    }
    /**
     * TarGet Rate
    */
    public get tgr() {
        return this.sparam(0);
    }
    /**
     * GuaRD effect rate
    */
    public get grd() {
        return this.sparam(1);
    }
    /**
     * RECovery effect rate
    */
    public get rec() {
        return this.sparam(2);
    }
    /**
     * PHArmacology
    */
    public get pha() {
        return this.sparam(3);
    }
    /**
     * Mp Cost Rate
    */
    public get mcr() {
        return this.sparam(4);
    }
    /**
     * Tp Charge Rate
    */
    public get tcr() {
        return this.sparam(5);
    }
    /**
     * Physical Damage Rate
    */
    public get pdr() {
        return this.sparam(6);
    }
    // Magic Damage Rate
    public get mdr() {
        return this.sparam(7);
    }
    // Floor Damage Rate
    public get fdr() {
        return this.sparam(8);
    }
    // EXperience Rate
    public get exr() {
        return this.sparam(9);
    }
    constructor() {
        this.initialize();
    }
    public initialize() {
        this.initMembers();
    };
    public initMembers() {
        this._hp = 1;
        this._mp = 0;
        this._tp = 0;
        this._hidden = false;
        this.clearParamPlus();
        this.clearStates();
        this.clearBuffs();
    };
    public clearParamPlus() {
        this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
    };
    public clearStates() {
        this._states = [];
        this._stateTurns = {};
    };
    public eraseState(stateId) {
        this._states.remove(stateId);
        delete this._stateTurns[stateId];
    };
    public isStateAffected(stateId) {
        return this._states.includes(stateId);
    };
    public isDeathStateAffected() {
        return this.isStateAffected(this.deathStateId());
    };
    public deathStateId() {
        return 1;
    };
    public resetStateCounts(stateId) {
        const state = $dataStates[stateId];
        const variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
        this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
    };
    public isStateExpired(stateId) {
        return this._stateTurns[stateId] === 0;
    };
    public updateStateTurns() {
        for (const stateId of this._states) {
            if (this._stateTurns[stateId] > 0) {
                this._stateTurns[stateId]--;
            }
        }
    };
    public clearBuffs() {
        this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
        this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
    };
    public eraseBuff(paramId) {
        this._buffs[paramId] = 0;
        this._buffTurns[paramId] = 0;
    };
    public buffLength() {
        return this._buffs.length;
    };
    public buff(paramId) {
        return this._buffs[paramId];
    };
    public isBuffAffected(paramId) {
        return this._buffs[paramId] > 0;
    };
    public isDebuffAffected(paramId) {
        return this._buffs[paramId] < 0;
    };
    public isBuffOrDebuffAffected(paramId) {
        return this._buffs[paramId] !== 0;
    };
    public isMaxBuffAffected(paramId) {
        return this._buffs[paramId] === 2;
    };
    public isMaxDebuffAffected(paramId) {
        return this._buffs[paramId] === -2;
    };
    public increaseBuff(paramId) {
        if (!this.isMaxBuffAffected(paramId)) {
            this._buffs[paramId]++;
        }
    };
    public decreaseBuff(paramId) {
        if (!this.isMaxDebuffAffected(paramId)) {
            this._buffs[paramId]--;
        }
    };
    public overwriteBuffTurns(paramId, turns) {
        if (this._buffTurns[paramId] < turns) {
            this._buffTurns[paramId] = turns;
        }
    };
    public isBuffExpired(paramId) {
        return this._buffTurns[paramId] === 0;
    };
    public updateBuffTurns() {
        for (let i = 0; i < this._buffTurns.length; i++) {
            if (this._buffTurns[i] > 0) {
                this._buffTurns[i]--;
            }
        }
    };
    public die() {
        this._hp = 0;
        this.clearStates();
        this.clearBuffs();
    };
    public revive() {
        if (this._hp === 0) {
            this._hp = 1;
        }
    };
    public states() {
        return this._states.map(id => $dataStates[id]);
    };
    public stateIcons() {
        return this.states()
            .map(state => state.iconIndex)
            .filter(iconIndex => iconIndex > 0);
    };
    public buffIcons() {
        const icons = [];
        for (let i = 0; i < this._buffs.length; i++) {
            if (this._buffs[i] !== 0) {
                icons.push(this.buffIconIndex(this._buffs[i], i));
            }
        }
        return icons;
    };
    public buffIconIndex(buffLevel, paramId) {
        if (buffLevel > 0) {
            return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
        } else if (buffLevel < 0) {
            return (
                Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId
            );
        } else {
            return 0;
        }
    };
    public allIcons() {
        return this.stateIcons().concat(this.buffIcons());
    };
    public traitObjects() {
        // Returns an array of the all objects having traits. States only here.
        return this.states();
    };
    public allTraits() {
        return this.traitObjects().reduce((r, obj) => r.concat(obj.traits), []);
    };
    public traits(code) {
        return this.allTraits().filter(trait => trait.code === code);
    };
    public traitsWithId(code, id) {
        return this.allTraits().filter(
            trait => trait.code === code && trait.dataId === id
        );
    };
    public traitsPi(code, id) {
        return this.traitsWithId(code, id).reduce((r, trait) => r * trait.value, 1);
    };
    public traitsSum(code, id) {
        return this.traitsWithId(code, id).reduce((r, trait) => r + trait.value, 0);
    };
    public traitsSumAll(code) {
        return this.traits(code).reduce((r, trait) => r + trait.value, 0);
    };
    public traitsSet(code) {
        return this.traits(code).reduce((r, trait) => r.concat(trait.dataId), []);
    };
    public paramBase(paramId:number) {
        return 0;
    };
    public paramPlus(paramId) {
        return this._paramPlus[paramId];
    };
    public paramBasePlus(paramId) {
        return Math.max(0, this.paramBase(paramId) + this.paramPlus(paramId));
    };
    public paramMin(paramId) {
        if (paramId === 0) {
            return 1; // MHP
        } else {
            return 0;
        }
    };
    public paramMax(paramId:number) {
        return Infinity;
    };
    public paramRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
    };
    public paramBuffRate(paramId) {
        return this._buffs[paramId] * 0.25 + 1.0;
    };
    public param(paramId) {
        const value =
            this.paramBasePlus(paramId) *
            this.paramRate(paramId) *
            this.paramBuffRate(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    };
    public xparam(xparamId) {
        return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
    };
    public sparam(sparamId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
    };
    public elementRate(elementId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
    };
    public debuffRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
    };
    public stateRate(stateId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
    };
    public stateResistSet() {
        return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
    };
    public isStateResist(stateId) {
        return this.stateResistSet().includes(stateId);
    };
    public attackElements() {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
    };
    public attackStates() {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
    };
    public attackStatesRate(stateId) {
        return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
    };
    public attackSpeed() {
        return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
    };
    public attackTimesAdd() {
        return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
    };
    public attackSkillId() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_SKILL);
        return set.length > 0 ? Math.max(...set) : 1;
    };
    public addedSkillTypes() {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
    };
    public isSkillTypeSealed(stypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).includes(stypeId);
    };
    public addedSkills() {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
    };
    public isSkillSealed(skillId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).includes(skillId);
    };
    public isEquipWtypeOk(wtypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).includes(wtypeId);
    };
    public isEquipAtypeOk(atypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).includes(atypeId);
    };
    public isEquipTypeLocked(etypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).includes(etypeId);
    };
    public isEquipTypeSealed(etypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).includes(etypeId);
    };
    public slotType() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
        return set.length > 0 ? Math.max(...set) : 0;
    };
    public isDualWield() {
        return this.slotType() === 1;
    };
    public actionPlusSet() {
        return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(
            trait => trait.value
        );
    };
    public specialFlag(flagId) {
        return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(
            trait => trait.dataId === flagId
        );
    };
    public collapseType() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
        return set.length > 0 ? Math.max(...set) : 0;
    };
    public partyAbility(abilityId) {
        return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(
            trait => trait.dataId === abilityId
        );
    };
    public isAutoBattle() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
    };
    public isGuard() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
    };
    public isSubstitute() {
        return (
            this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove()
        );
    };
    public isPreserveTp() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
    };
    public addParam(paramId, value) {
        this._paramPlus[paramId] += value;
        this.refresh();
    };
    public setHp(hp) {
        this._hp = hp;
        this.refresh();
    };
    public setMp(mp) {
        this._mp = mp;
        this.refresh();
    };
    public setTp(tp) {
        this._tp = tp;
        this.refresh();
    };
    public maxTp() {
        return 100;
    };
    public refresh() {
        for (const stateId of this.stateResistSet()) {
            this.eraseState(stateId);
        }
        this._hp = this._hp.clamp(0, this.mhp);
        this._mp = this._mp.clamp(0, this.mmp);
        this._tp = this._tp.clamp(0, this.maxTp());
    };
    public recoverAll() {
        this.clearStates();
        this._hp = this.mhp;
        this._mp = this.mmp;
    };
    public hpRate() {
        return this.hp / this.mhp;
    };
    public mpRate() {
        return this.mmp > 0 ? this.mp / this.mmp : 0;
    };
    public tpRate() {
        return this.tp / this.maxTp();
    };
    public hide() {
        this._hidden = true;
    };
    public appear() {
        this._hidden = false;
    };
    public isHidden() {
        return this._hidden;
    };
    public isAppeared() {
        return !this.isHidden();
    };
    public isDead() {
        return this.isAppeared() && this.isDeathStateAffected();
    };
    public isAlive() {
        return this.isAppeared() && !this.isDeathStateAffected();
    };
    public isDying() {
        return this.isAlive() && this._hp < this.mhp / 4;
    };
    public isRestricted() {
        return this.isAppeared() && this.restriction() > 0;
    };
    public canInput() {
        // prettier-ignore
        return this.isAppeared() && this.isActor() &&
            !this.isRestricted() && !this.isAutoBattle();
    };
    public canMove() {
        return this.isAppeared() && this.restriction() < 4;
    };
    public isConfused() {
        return (
            this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3
        );
    };
    public confusionLevel() {
        return this.isConfused() ? this.restriction() : 0;
    };
    public isActor() {
        return false;
    };
    public isEnemy() {
        return false;
    };
    public sortStates() {
        this._states.sort((a, b) => {
            const p1 = $dataStates[a].priority;
            const p2 = $dataStates[b].priority;
            if (p1 !== p2) {
                return p2 - p1;
            }
            return a - b;
        });
    };
    public restriction() {
        const restrictions = this.states().map(state => state.restriction);
        return Math.max(0, ...restrictions);
    };
    public addNewState(stateId) {
        if (stateId === this.deathStateId()) {
            this.die();
        }
        const restricted = this.isRestricted();
        this._states.push(stateId);
        this.sortStates();
        if (!restricted && this.isRestricted()) {
            this.onRestrict();
        }
    };
    public onRestrict() {
        //
    };
    public mostImportantStateText() {
        for (const state of this.states()) {
            if (state.message3) {
                return state.message3;
            }
        }
        return "";
    };
    public stateMotionIndex() {
        const states = this.states();
        if (states.length > 0) {
            return states[0].motion;
        } else {
            return 0;
        }
    };
    public stateOverlayIndex() {
        const states = this.states();
        if (states.length > 0) {
            return states[0].overlay;
        } else {
            return 0;
        }
    };
    public isSkillWtypeOk(skill) {
        return true;
    };
    public skillMpCost(skill) {
        return Math.floor(skill.mpCost * this.mcr);
    };
    public skillTpCost(skill) {
        return skill.tpCost;
    };
    public canPaySkillCost(skill) {
        return (
            this._tp >= this.skillTpCost(skill) &&
            this._mp >= this.skillMpCost(skill)
        );
    };
    public paySkillCost(skill) {
        this._mp -= this.skillMpCost(skill);
        this._tp -= this.skillTpCost(skill);
    };
    public isOccasionOk(item) {
        if ($gameParty.inBattle()) {
            return item.occasion === 0 || item.occasion === 1;
        } else {
            return item.occasion === 0 || item.occasion === 2;
        }
    };
    public meetsUsableItemConditions(item) {
        return this.canMove() && this.isOccasionOk(item);
    };
    public meetsSkillConditions(skill) {
        return (
            this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) &&
            this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) &&
            !this.isSkillTypeSealed(skill.stypeId)
        );
    };
    public meetsItemConditions(item) {
        return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
    };
    public canUse(item) {
        if (!item) {
            return false;
        } else if (DataManager.isSkill(item)) {
            return this.meetsSkillConditions(item);
        } else if (DataManager.isItem(item)) {
            return this.meetsItemConditions(item);
        } else {
            return false;
        }
    };
    public canEquip(item) {
        if (!item) {
            return false;
        } else if (DataManager.isWeapon(item)) {
            return this.canEquipWeapon(item);
        } else if (DataManager.isArmor(item)) {
            return this.canEquipArmor(item);
        } else {
            return false;
        }
    };
    public canEquipWeapon(item) {
        return (
            this.isEquipWtypeOk(item.wtypeId) &&
            !this.isEquipTypeSealed(item.etypeId)
        );
    };
    public canEquipArmor(item) {
        return (
            this.isEquipAtypeOk(item.atypeId) &&
            !this.isEquipTypeSealed(item.etypeId)
        );
    };
    public guardSkillId() {
        return 2;
    };
    public canAttack() {
        return this.canUse($dataSkills[this.attackSkillId()]);
    };
    public canGuard() {
        return this.canUse($dataSkills[this.guardSkillId()]);
    };

}
