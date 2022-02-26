export class Game_ActionResult {
    used;
    missed;
    evaded;
    physical;
    drain;
    critical;
    success;
    hpAffected;
    hpDamage;
    mpDamage;
    tpDamage;
    addedStates;
    removedStates;
    addedBuffs;
    addedDebuffs;
    removedBuffs;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(...args) {
        this.clear();
    }
    clear() {
        this.used = false;
        this.missed = false;
        this.evaded = false;
        this.physical = false;
        this.drain = false;
        this.critical = false;
        this.success = false;
        this.hpAffected = false;
        this.hpDamage = 0;
        this.mpDamage = 0;
        this.tpDamage = 0;
        this.addedStates = [];
        this.removedStates = [];
        this.addedBuffs = [];
        this.addedDebuffs = [];
        this.removedBuffs = [];
    }
    addedStateObjects() {
        return this.addedStates.map(id => window.$dataStates[id]);
    }
    removedStateObjects() {
        return this.removedStates.map(id => window.$dataStates[id]);
    }
    isStatusAffected() {
        return (this.addedStates.length > 0 ||
            this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 ||
            this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0);
    }
    isHit() {
        return this.used && !this.missed && !this.evaded;
    }
    isStateAdded(stateId) {
        return this.addedStates.includes(stateId);
    }
    pushAddedState(stateId) {
        if (!this.isStateAdded(stateId)) {
            this.addedStates.push(stateId);
        }
    }
    isStateRemoved(stateId) {
        return this.removedStates.includes(stateId);
    }
    pushRemovedState(stateId) {
        if (!this.isStateRemoved(stateId)) {
            this.removedStates.push(stateId);
        }
    }
    isBuffAdded(paramId) {
        return this.addedBuffs.includes(paramId);
    }
    pushAddedBuff(paramId) {
        if (!this.isBuffAdded(paramId)) {
            this.addedBuffs.push(paramId);
        }
    }
    isDebuffAdded(paramId) {
        return this.addedDebuffs.includes(paramId);
    }
    pushAddedDebuff(paramId) {
        if (!this.isDebuffAdded(paramId)) {
            this.addedDebuffs.push(paramId);
        }
    }
    isBuffRemoved(paramId) {
        return this.removedBuffs.includes(paramId);
    }
    pushRemovedBuff(paramId) {
        if (!this.isBuffRemoved(paramId)) {
            this.removedBuffs.push(paramId);
        }
    }
}
