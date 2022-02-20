import { Game_Action, Game_Battler, Game_BattlerBase, Game_Item } from "./index.js";
declare const BattleManager:any;
declare const DataManager:any;
declare const TextManager:any;
declare const SoundManager:any;
//-----------------------------------------------------------------------------
/**
 * Game_Actor
 * 
 * The game object class for an actor.
*/
export class Game_Actor extends Game_Battler {
    _level: number;
    _actorId: number;
    _name: string;
    _nickname: string;
    _classId: number;
    _characterName: string;
    _characterIndex: number;
    _faceName: string;
    _faceIndex: number;
    _battlerName: string;
    _exp: {}
    _skills: number[];
    _equips: Game_Item[];
    _actionInputIndex: number;
    _lastMenuSkill: Nullable<Game_Item>;
    _lastBattleSkill: Nullable<Game_Item>;
    _lastCommandSymbol: string;
    _profile: string;
    _stateSteps: {}
    get level() {
        return this._level;
    }
    constructor(...args: [number]) {
        super(...args);
        this.initialize(...args);
    }


    public initialize(actorId) {
        Game_Battler.prototype.initialize.call(this);
        this.setup(actorId);
    }

    public initMembers() {
        Game_Battler.prototype.initMembers.call(this);
        this._actorId = 0;
        this._name = "";
        this._nickname = "";
        this._classId = 0;
        this._level = 0;
        this._characterName = "";
        this._characterIndex = 0;
        this._faceName = "";
        this._faceIndex = 0;
        this._battlerName = "";
        this._exp = {}
        this._skills = [];
        this._equips = [];
        this._actionInputIndex = 0;
        this._lastMenuSkill = new Game_Item();
        this._lastBattleSkill = new Game_Item();
        this._lastCommandSymbol = "";
    }

    public setup(actorId) {
        const actor = $dataActors[actorId];
        this._actorId = actorId;
        this._name = actor.name;
        this._nickname = actor.nickname;
        this._profile = actor.profile;
        this._classId = actor.classId;
        this._level = actor.initialLevel;
        this.initImages();
        this.initExp();
        this.initSkills();
        this.initEquips(actor.equips);
        this.clearParamPlus();
        this.recoverAll();
    }

    public actorId() {
        return this._actorId;
    }

    public actor() {
        return $dataActors[this._actorId];
    }

    public name() {
        return this._name;
    }

    public setName(name) {
        this._name = name;
    }

    public nickname() {
        return this._nickname;
    }

    public setNickname(nickname) {
        this._nickname = nickname;
    }

    public profile() {
        return this._profile;
    }

    public setProfile(profile) {
        this._profile = profile;
    }

    public characterName() {
        return this._characterName;
    }

    public characterIndex() {
        return this._characterIndex;
    }

    public faceName() {
        return this._faceName;
    }

    public faceIndex() {
        return this._faceIndex;
    }

    public battlerName() {
        return this._battlerName;
    }

    public clearStates() {
        Game_Battler.prototype.clearStates.call(this);
        this._stateSteps = {}
    }

    public eraseState(stateId) {
        Game_Battler.prototype.eraseState.call(this, stateId);
        delete this._stateSteps[stateId];
    }

    public resetStateCounts(stateId) {
        Game_Battler.prototype.resetStateCounts.call(this, stateId);
        this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
    }

    public initImages() {
        const actor = this.actor();
        this._characterName = actor.characterName;
        this._characterIndex = actor.characterIndex;
        this._faceName = actor.faceName;
        this._faceIndex = actor.faceIndex;
        this._battlerName = actor.battlerName;
    }

    public expForLevel(level) {
        const c = this.currentClass();
        const basis = c.expParams[0];
        const extra = c.expParams[1];
        const acc_a = c.expParams[2];
        const acc_b = c.expParams[3];
        return Math.round(
            (basis * Math.pow(level - 1, 0.9 + acc_a / 250) * level * (level + 1)) /
            (6 + Math.pow(level, 2) / 50 / acc_b) +
            (level - 1) * extra
        );
    }

    public initExp() {
        this._exp[this._classId] = this.currentLevelExp();
    }

    public currentExp() {
        return this._exp[this._classId];
    }

    public currentLevelExp() {
        return this.expForLevel(this._level);
    }

    public nextLevelExp() {
        return this.expForLevel(this._level + 1);
    }

    public nextRequiredExp() {
        return this.nextLevelExp() - this.currentExp();
    }

    public maxLevel() {
        return this.actor().maxLevel;
    }

    public isMaxLevel() {
        return this._level >= this.maxLevel();
    }

    public initSkills() {
        this._skills = [];
        for (const learning of this.currentClass().learnings) {
            if (learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }
    }

    public initEquips(equips) {
        const slots = this.equipSlots();
        const maxSlots = slots.length;
        this._equips = [];
        for (let i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item();
        }
        for (let j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
        this.refresh();
    }

    public equipSlots() {
        const slots = [];
        for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
            slots.push(i);
        }
        if (slots.length >= 2 && this.isDualWield()) {
            slots[1] = 1;
        }
        return slots;
    }

    public equips() {
        return this._equips.map(item => item.object());
    }

    public weapons() {
        return this.equips().filter(item => item && DataManager.isWeapon(item)) as Weapon[];
    }

    public armors() {
        return this.equips().filter(item => item && DataManager.isArmor(item)) as Armor[];
    }

    public hasWeapon(weapon) {
        return this.weapons().includes(weapon);
    }

    public hasArmor(armor) {
        return this.armors().includes(armor);
    }

    public isEquipChangeOk(slotId) {
        return (
            !this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId])
        );
    }

    public changeEquip(slotId, item) {
        if (
            this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)
        ) {
            this._equips[slotId].setObject(item);
            this.refresh();
        }
    }

    public forceChangeEquip(slotId, item) {
        this._equips[slotId].setObject(item);
        this.releaseUnequippableItems(true);
        this.refresh();
    }

    public tradeItemWithParty(newItem, oldItem) {
        if (newItem && !$gameParty.hasItem(newItem)) {
            return false;
        } else {
            $gameParty.gainItem(oldItem, 1);
            $gameParty.loseItem(newItem, 1);
            return true;
        }
    }

    public changeEquipById(etypeId, itemId) {
        const slotId = etypeId - 1;
        if (this.equipSlots()[slotId] === 1) {
            this.changeEquip(slotId, $dataWeapons[itemId]);
        } else {
            this.changeEquip(slotId, $dataArmors[itemId]);
        }
    }

    public isEquipped(item) {
        return this.equips().includes(item);
    }

    public discardEquip(item) {
        const slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this._equips[slotId].setObject(null);
        }
    }

    public releaseUnequippableItems(forcing) {
        for (; ;) {
            const slots = this.equipSlots();
            const equips = this.equips() ;
            let changed = false;
            for (let i = 0; i < equips.length; i++) {
                const item = equips[i];
                //@ts-ignore
                if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
    }

    public clearEquipments() {
        const maxSlots = this.equipSlots().length;
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }
    }

    public optimizeEquipments() {
        const maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }
    }

    public bestEquipItem(slotId) {
        const etypeId = this.equipSlots()[slotId];
        const items = $gameParty
            .equipItems()
            .filter(item => item.etypeId === etypeId && this.canEquip(item));
        let bestItem = null;
        let bestPerformance = -1000;
        for (let i = 0; i < items.length; i++) {
            const performance = this.calcEquipItemPerformance(items[i]);
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestItem = items[i];
            }
        }
        return bestItem;
    }

    public calcEquipItemPerformance(item) {
        return item.params.reduce((a, b) => a + b);
    }

    public isSkillWtypeOk(skill) {
        const wtypeId1 = skill.requiredWtypeId1;
        const wtypeId2 = skill.requiredWtypeId2;
        if (
            (wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))
        ) {
            return true;
        } else {
            return false;
        }
    }

    public isWtypeEquipped(wtypeId) {
        return this.weapons().some(weapon => weapon.wtypeId === wtypeId);
    }

    public refresh() {
        this.releaseUnequippableItems(false);
        Game_Battler.prototype.refresh.call(this);
    }

    public hide() {
        Game_Battler.prototype.hide.call(this);
        $gameTemp.requestBattleRefresh();
    }

    public isActor() {
        return true;
    }

    public friendsUnit() {
        return $gameParty;
    }

    public opponentsUnit() {
        return $gameTroop;
    }

    public index() {
        return $gameParty.members().indexOf(this);
    }

    public isBattleMember() {
        return $gameParty.battleMembers().includes(this);
    }

    public isFormationChangeOk() {
        return true;
    }

    public currentClass() {
        return $dataClasses[this._classId];
    }

    public isClass(gameClass) {
        return gameClass && this._classId === gameClass.id;
    }

    public skillTypes() {
        const skillTypes = this.addedSkillTypes().sort((a, b) => a - b);
        return skillTypes.filter((x, i, self) => self.indexOf(x) === i);
    }

    public skills() {
        const list = [];
        for (const id of this._skills.concat(this.addedSkills())) {
            if (!list.includes($dataSkills[id])) {
                list.push($dataSkills[id]);
            }
        }
        return list;
    }

    public usableSkills() {
        return this.skills().filter(skill => this.canUse(skill));
    }

    public traitObjects() {
        const objects = Game_Battler.prototype.traitObjects.call(this);
        objects.push(this.actor(), this.currentClass());
        for (const item of this.equips()) {
            if (item) {
                objects.push(item);
            }
        }
        return objects;
    }

    public attackElements() {
        const set = Game_Battler.prototype.attackElements.call(this);
        if (this.hasNoWeapons() && !set.includes(this.bareHandsElementId())) {
            set.push(this.bareHandsElementId());
        }
        return set;
    }

    public hasNoWeapons() {
        return this.weapons().length === 0;
    }

    public bareHandsElementId() {
        return 1;
    }

    public paramBase(paramId) {
        return this.currentClass().params[paramId][this._level];
    }

    public paramPlus(paramId) {
        let value = Game_Battler.prototype.paramPlus.call(this, paramId);
        for (const item of this.equips()) {
            if (item) {
                //@ts-ignore
                value += item.params[paramId];
            }
        }
        return value;
    }

    public attackAnimationId1() {
        if (this.hasNoWeapons()) {
            return this.bareHandsAnimationId();
        } else {
            const weapons = this.weapons();
            return weapons[0] ? weapons[0].animationId : 0;
        }
    }

    public attackAnimationId2() {
        const weapons = this.weapons();
        return weapons[1] ? weapons[1].animationId : 0;
    }

    public bareHandsAnimationId() {
        return 1;
    }

    public changeExp(exp, show) {
        this._exp[this._classId] = Math.max(exp, 0);
        const lastLevel = this._level;
        const lastSkills = this.skills();
        while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
            this.levelUp();
        }
        while (this.currentExp() < this.currentLevelExp()) {
            this.levelDown();
        }
        if (show && this._level > lastLevel) {
            this.displayLevelUp(this.findNewSkills(lastSkills));
        }
        this.refresh();
    }

    public levelUp() {
        this._level++;
        for (const learning of this.currentClass().learnings) {
            if (learning.level === this._level) {
                this.learnSkill(learning.skillId);
            }
        }
    }

    public levelDown() {
        this._level--;
    }

    public findNewSkills(lastSkills) {
        const newSkills = this.skills();
        for (const lastSkill of lastSkills) {
            newSkills.remove(lastSkill);
        }
        return newSkills;
    }

    public displayLevelUp(newSkills) {
        const text = TextManager.levelUp.format(this._name,TextManager.level,this._level);
        $gameMessage.newPage();
        $gameMessage.add(text);
        for (const skill of newSkills) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        }
    }

    public gainExp(exp) {
        const newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
        this.changeExp(newExp, this.shouldDisplayLevelUp());
    }

    public finalExpRate() {
        return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
    }

    public benchMembersExpRate() {
        return $dataSystem.optExtraExp ? 1 : 0;
    }

    public shouldDisplayLevelUp() {
        return true;
    }

    public changeLevel(level, show) {
        level = level.clamp(1, this.maxLevel());
        this.changeExp(this.expForLevel(level), show);
    }

    public learnSkill(skillId) {
        if (!this.isLearnedSkill(skillId)) {
            this._skills.push(skillId);
            this._skills.sort((a, b) => a - b);
        }
    }

    public forgetSkill(skillId) {
        this._skills.remove(skillId);
    }

    public isLearnedSkill(skillId) {
        return this._skills.includes(skillId);
    }

    public hasSkill(skillId) {
        return this.skills().includes($dataSkills[skillId]);
    }

    public changeClass(classId, keepExp) {
        if (keepExp) {
            this._exp[classId] = this.currentExp();
        }
        this._classId = classId;
        this._level = 0;
        this.changeExp(this._exp[this._classId] || 0, false);
        this.refresh();
    }

    public setCharacterImage(
        characterName,
        characterIndex
    ) {
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    }

    public setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
        $gameTemp.requestBattleRefresh();
    }

    public setBattlerImage(battlerName) {
        this._battlerName = battlerName;
    }

    public isSpriteVisible() {
        return $gameSystem.isSideView();
    }

    public performActionStart(action) {
        Game_Battler.prototype.performActionStart.call(this, action);
    }

    public performAction(action) {
        Game_Battler.prototype.performAction.call(this, action);
        if (action.isAttack()) {
            this.performAttack();
        } else if (action.isGuard()) {
            this.requestMotion("guard");
        } else if (action.isMagicSkill()) {
            this.requestMotion("spell");
        } else if (action.isSkill()) {
            this.requestMotion("skill");
        } else if (action.isItem()) {
            this.requestMotion("item");
        }
    }

    public performActionEnd() {
        Game_Battler.prototype.performActionEnd.call(this);
    }

    public performAttack() {
        const weapons = this.weapons();
        const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        const attackMotion = $dataSystem.attackMotions[wtypeId];
        if (attackMotion) {
            if (attackMotion.type === 0) {
                this.requestMotion("thrust");
            } else if (attackMotion.type === 1) {
                this.requestMotion("swing");
            } else if (attackMotion.type === 2) {
                this.requestMotion("missile");
            }
            this.startWeaponAnimation(attackMotion.weaponImageId);
        }
    }

    public performDamage() {
        Game_Battler.prototype.performDamage.call(this);
        if (this.isSpriteVisible()) {
            this.requestMotion("damage");
        } else {
            $gameScreen.startShake(5, 5, 10);
        }
        SoundManager.playActorDamage();
    }

    public performEvasion() {
        Game_Battler.prototype.performEvasion.call(this);
        this.requestMotion("evade");
    }

    public performMagicEvasion() {
        Game_Battler.prototype.performMagicEvasion.call(this);
        this.requestMotion("evade");
    }

    public performCounter() {
        Game_Battler.prototype.performCounter.call(this);
        this.performAttack();
    }

    public performCollapse() {
        Game_Battler.prototype.performCollapse.call(this);
        if ($gameParty.inBattle()) {
            SoundManager.playActorCollapse();
        }
    }

    public performVictory() {
        this.setActionState("done");
        if (this.canMove()) {
            this.requestMotion("victory");
        }
    }

    public performEscape() {
        if (this.canMove()) {
            this.requestMotion("escape");
        }
    }

    public makeActionList() {
        const list = [];
        const attackAction = new Game_Action(this);
        attackAction.setAttack();
        list.push(attackAction);
        for (const skill of this.usableSkills()) {
            const skillAction = new Game_Action(this);
            skillAction.setSkill(skill.id);
            list.push(skillAction);
        }
        return list;
    }

    public makeAutoBattleActions() {
        for (let i = 0; i < this.numActions(); i++) {
            const list = this.makeActionList();
            let maxValue = Number.MIN_VALUE;
            for (const action of list) {
                const value = action.evaluate();
                if (value > maxValue) {
                    maxValue = value;
                    this.setAction(i, action);
                }
            }
        }
        this.setActionState("waiting");
    }

    public makeConfusionActions() {
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setConfusion();
        }
        this.setActionState("waiting");
    }

    public makeActions() {
        Game_Battler.prototype.makeActions.call(this);
        if (this.numActions() > 0) {
            this.setActionState("undecided");
        } else {
            this.setActionState("waiting");
        }
        if (this.isAutoBattle()) {
            this.makeAutoBattleActions();
        } else if (this.isConfused()) {
            this.makeConfusionActions();
        }
    }

    public onPlayerWalk() {
        this.clearResult();
        this.checkFloorEffect();
        if ($gamePlayer.isNormal()) {
            this.turnEndOnMap();
            for (const state of this.states()) {
                this.updateStateSteps(state);
            }
            this.showAddedStates();
            this.showRemovedStates();
        }
    }

    public updateStateSteps(state) {
        if (state.removeByWalking) {
            if (this._stateSteps[state.id] > 0) {
                if (--this._stateSteps[state.id] === 0) {
                    this.removeState(state.id);
                }
            }
        }
    }

    public showAddedStates() {
        for (const state of this.result().addedStateObjects()) {
            if (state.message1) {
                $gameMessage.add(state.message1.format(this._name));
            }
        }
    }

    public showRemovedStates() {
        for (const state of this.result().removedStateObjects()) {
            if (state.message4) {
                $gameMessage.add(state.message4.format(this._name));
            }
        }
    }

    public stepsForTurn() {
        return 20;
    }

    public turnEndOnMap() {
        if ($gameParty.steps() % this.stepsForTurn() === 0) {
            this.onTurnEnd();
            if (this.result().hpDamage > 0) {
                this.performMapDamage();
            }
        }
    }

    public checkFloorEffect() {
        if ($gamePlayer.isOnDamageFloor()) {
            this.executeFloorDamage();
        }
    }

    public executeFloorDamage() {
        const floorDamage = Math.floor(this.basicFloorDamage() * this.fdr);
        const realDamage = Math.min(floorDamage, this.maxFloorDamage());
        this.gainHp(-realDamage);
        if (realDamage > 0) {
            this.performMapDamage();
        }
    }

    public basicFloorDamage() {
        return 10;
    }

    public maxFloorDamage() {
        return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
    }

    public performMapDamage() {
        if (!$gameParty.inBattle()) {
            $gameScreen.startFlashForDamage();
        }
    }

    public clearActions() {
        Game_Battler.prototype.clearActions.call(this);
        this._actionInputIndex = 0;
    }

    public inputtingAction() {
        return this.action(this._actionInputIndex);
    }

    public selectNextCommand() {
        if (this._actionInputIndex < this.numActions() - 1) {
            this._actionInputIndex++;
            return true;
        } else {
            return false;
        }
    }

    public selectPreviousCommand() {
        if (this._actionInputIndex > 0) {
            this._actionInputIndex--;
            return true;
        } else {
            return false;
        }
    }

    public lastSkill() {
        if ($gameParty.inBattle()) {
            return this.lastBattleSkill();
        } else {
            return this.lastMenuSkill();
        }
    }

    public lastMenuSkill() {
        return this._lastMenuSkill.object();
    }

    public setLastMenuSkill(skill) {
        this._lastMenuSkill.setObject(skill);
    }

    public lastBattleSkill() {
        return this._lastBattleSkill.object();
    }

    public setLastBattleSkill(skill) {
        this._lastBattleSkill.setObject(skill);
    }

    public lastCommandSymbol() {
        return this._lastCommandSymbol;
    }

    public setLastCommandSymbol(symbol) {
        this._lastCommandSymbol = symbol;
    }

    public testEscape(item) {
        return item.effects.some(
            effect => effect && effect.code === Game_Action.EFFECT_SPECIAL
        );
    }

    public meetsUsableItemConditions(item) {
        if ($gameParty.inBattle()) {
            if (!BattleManager.canEscape() && this.testEscape(item)) {
                return false;
            }
        }
        return Game_BattlerBase.prototype.meetsUsableItemConditions.call(this,item);
    }

    public onEscapeFailure() {
        if (BattleManager.isTpb()) {
            this.applyTpbPenalty();
        }
        this.clearActions();
        this.requestMotionRefresh();
    }

}
