import { DataManager, TextManager } from "../Manager/index.js";
import { Game_Item, Game_Unit, Game_Actor } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Game_Party
 * 
 * The game object class for the party. Information such as gold and items is
 * included.
*/
export class Game_Party extends Game_Unit {
    static ABILITY_ENCOUNTER_HALF = 0;
    static ABILITY_ENCOUNTER_NONE = 1;
    static ABILITY_CANCEL_SURPRISE = 2;
    static ABILITY_RAISE_PREEMPTIVE = 3;
    static ABILITY_GOLD_DOUBLE = 4;
    static ABILITY_DROP_ITEM_DOUBLE = 5;
    _gold: number;
    _steps: number;
    _lastItem: Nullable<Game_Item>;
    _menuActorId: number;
    _targetActorId: number;
    _actors: number[];
    _items: { [id: number]: null }
    _weapons: { [id: number]: null }
    _armors: { [id: number]: null }
    constructor(...args: any[]) {
        super();
        this.initialize(...args);
    }



    public initialize(...args) {
        Game_Unit.prototype.initialize.call(this);
        this._gold = 0;
        this._steps = 0;
        this._lastItem = new Game_Item();
        this._menuActorId = 0;
        this._targetActorId = 0;
        this._actors = [];
        this.initAllItems();
    }

    public initAllItems() {
        this._items = {}
        this._weapons = {}
        this._armors = {}
    }

    public exists() {
        return this._actors.length > 0;
    }

    public size() {
        return this.members().length;
    }

    public isEmpty() {
        return this.size() === 0;
    }

    public members() {
        return this.inBattle() ? this.battleMembers() : this.allMembers();
    }

    public allMembers() {
        return this._actors.map(id => window.$gameActors.actor(id));
    }

    public battleMembers() {
        return this.allBattleMembers().filter(actor => actor.isAppeared());
    }

    public hiddenBattleMembers() {
        return this.allBattleMembers().filter(actor => actor.isHidden());
    };

    public allBattleMembers() {
        return this.allMembers().slice(0, this.maxBattleMembers());
    };
    public maxBattleMembers() {
        return 4;
    }

    public leader() {
        return this.battleMembers()[0];
    }

    public removeInvalidMembers() {
        for (const actorId of this._actors) {
            if (!window.$dataActors[actorId]) {
                this._actors.remove(actorId);
            }
        }
    }

    public reviveBattleMembers() {
        for (const actor of this.battleMembers()) {
            if (actor.isDead()) {
                actor.setHp(1);
            }
        }
    }

    public items() {
        return Object.keys(this._items).map<Item>(id => window.$dataItems[id]);
    }

    public weapons() {
        return Object.keys(this._weapons).map<Weapon>(id => window.$dataWeapons[id]);
    }

    public armors() {
        return Object.keys(this._armors).map(id => window.$dataArmors[id]);
    }

    public equipItems() {
        return this.weapons().concat(this.armors());
    }

    public allItems() {
        return (this.items() as (Item|Weapon)[]).concat(this.equipItems());
    }

    public itemContainer(item) {
        if (!item) {
            return null;
        } else if (DataManager.isItem(item)) {
            return this._items;
        } else if (DataManager.isWeapon(item)) {
            return this._weapons;
        } else if (DataManager.isArmor(item)) {
            return this._armors;
        } else {
            return null;
        }
    }

    public setupStartingMembers() {
        this._actors = [];
        for (const actorId of window.$dataSystem.partyMembers) {
            if (window.$gameActors.actor(actorId)) {
                this._actors.push(actorId);
            }
        }
    }

    public name() {
        const numBattleMembers = this.battleMembers().length;
        if (numBattleMembers === 0) {
            return "";
        } else if (numBattleMembers === 1) {
            return this.leader().name();
        } else {
            return TextManager.partyName.format(this.leader().name());
        }
    }

    public setupBattleTest() {
        this.setupBattleTestMembers();
        this.setupBattleTestItems();
    }

    public setupBattleTestMembers() {
        for (const battler of window.$dataSystem.testBattlers) {
            const actor = window.$gameActors.actor(battler.actorId);
            if (actor) {
                actor.changeLevel(battler.level, false);
                actor.initEquips(battler.equips);
                actor.recoverAll();
                this.addActor(battler.actorId);
            }
        }
    }

    public setupBattleTestItems() {
        for (const item of window.$dataItems) {
            if (item && item.name.length > 0) {
                this.gainItem(item, this.maxItems(item));
            }
        }
    }

    public highestLevel() {
        return Math.max(...this.members().map(actor => actor.level));
    }

    public addActor(actorId) {
        if (!this._actors.includes(actorId)) {
            this._actors.push(actorId);
            window.$gamePlayer.refresh();
            window.$gameMap.requestRefresh();
            window.$gameTemp.requestBattleRefresh();
            if (this.inBattle()) {
                const actor = window.$gameActors.actor(actorId);
                if (this.battleMembers().includes(actor)) {
                    actor.onBattleStart();
                }
            }
        }
    }

    public removeActor(actorId) {
        if (this._actors.includes(actorId)) {
            const actor = window.$gameActors.actor(actorId);
            const wasBattleMember = this.battleMembers().includes(actor);
            this._actors.remove(actorId);
            window.$gamePlayer.refresh();
            window.$gameMap.requestRefresh();
            window.$gameTemp.requestBattleRefresh();
            if (this.inBattle() && wasBattleMember) {
                actor.onBattleEnd();
            }
        }
    }

    public gold() {
        return this._gold;
    }

    public gainGold(amount) {
        this._gold = (this._gold + amount).clamp(0, this.maxGold());
    }

    public loseGold(amount) {
        this.gainGold(-amount);
    }

    public maxGold() {
        return 99999999;
    }

    public steps() {
        return this._steps;
    }

    public increaseSteps() {
        this._steps++;
    }

    public numItems(item) {
        const container = this.itemContainer(item);
        return container ? container[item.id] || 0 : 0;
    }

    public maxItems(...args: any[]/*item*/) {
        return 99;
    }

    public hasMaxItems(item) {
        return this.numItems(item) >= this.maxItems(item);
    }

    public hasItem(item, includeEquip?) {
        if (this.numItems(item) > 0) {
            return true;
        } else if (includeEquip && this.isAnyMemberEquipped(item)) {
            return true;
        } else {
            return false;
        }
    }

    public isAnyMemberEquipped(item) {
        return this.members().some(actor => actor.equips().includes(item));
    }

    public gainItem(item, amount, includeEquip?: boolean) {
        const container = this.itemContainer(item);
        if (container) {
            const lastNumber = this.numItems(item);
            const newNumber = lastNumber + amount;
            container[item.id] = newNumber.clamp(0, this.maxItems(item));
            if (container[item.id] === 0) {
                delete container[item.id];
            }
            if (includeEquip && newNumber < 0) {
                this.discardMembersEquip(item, -newNumber);
            }
            window.$gameMap.requestRefresh();
        }
    }

    public discardMembersEquip(item, amount) {
        let n = amount;
        for (const actor of this.members()) {
            while (n > 0 && actor.isEquipped(item)) {
                actor.discardEquip(item);
                n--;
            }
        }
    }

    public loseItem(item, amount, includeEquip?: boolean) {
        this.gainItem(item, -amount, includeEquip);
    }

    public consumeItem(item) {
        if (DataManager.isItem(item) && item.consumable) {
            this.loseItem(item, 1);
        }
    }

    public canUse(item) {
        return this.members().some(actor => actor.canUse(item));
    }

    public canInput() {
        return this.members().some(actor => actor.canInput());
    }

    public isAllDead() {
        if (Game_Unit.prototype.isAllDead.call(this)) {
            return this.inBattle() || !this.isEmpty();
        } else {
            return false;
        }
    }

    public isEscaped (item?) {
        return this.isAllDead() && this.hiddenBattleMembers().length > 0;
    };
    
    public onPlayerWalk() {
        for (const actor of this.members()) {
            actor.onPlayerWalk();
        }
    }

    public menuActor() {
        let actor = window.$gameActors.actor(this._menuActorId);
        if (!this.members().includes(actor)) {
            actor = this.members()[0];
        }
        return actor;
    }

    public setMenuActor(actor) {
        this._menuActorId = actor.actorId();
    }

    public makeMenuActorNext() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    }

    public makeMenuActorPrevious() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + this.members().length - 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    }

    public targetActor() {
        let actor = window.$gameActors.actor(this._targetActorId);
        if (!this.members().includes(actor)) {
            actor = this.members()[0];
        }
        return actor;
    }

    public setTargetActor(actor) {
        this._targetActorId = actor.actorId();
    }

    public lastItem() {
        return this._lastItem.object();
    }

    public setLastItem(item) {
        this._lastItem.setObject(item);
    }

    public swapOrder(index1, index2) {
        const temp = this._actors[index1];
        this._actors[index1] = this._actors[index2];
        this._actors[index2] = temp;
        window.$gamePlayer.refresh();
    }

    public charactersForSavefile() {
        return this.battleMembers().map((actor: Game_Actor) => [
            actor.characterName(),
            actor.characterIndex()
        ]);
    }

    public facesForSavefile() {
        return this.battleMembers().map((actor: Game_Actor) => [
            actor.faceName(),
            actor.faceIndex()
        ]);
    }

    public partyAbility(abilityId) {
        return this.battleMembers().some(actor => actor.partyAbility(abilityId));
    }

    public hasEncounterHalf() {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
    }

    public hasEncounterNone() {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
    }

    public hasCancelSurprise() {
        return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
    }

    public hasRaisePreemptive() {
        return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
    }

    public hasGoldDouble() {
        return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
    }

    public hasDropItemDouble() {
        return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
    }

    public ratePreemptive(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    }

    public rateSurprise(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.03 : 0.05;
        if (this.hasCancelSurprise()) {
            rate = 0;
        }
        return rate;
    }

    public performVictory() {
        for (const actor of this.members()) {
            actor.performVictory();
        }
    }

    public performEscape() {
        for (const actor of this.members()) {
            actor.performEscape();
        }
    }

    public removeBattleStates() {
        for (const actor of this.members()) {
            actor.removeBattleStates();
        }
    }

    public requestMotionRefresh() {
        for (const actor of this.members()) {
            actor.requestMotionRefresh();
        }
    }

    public onEscapeFailure() {
        for (const actor of this.members()) {
            actor.onEscapeFailure();
        }
    }
}
