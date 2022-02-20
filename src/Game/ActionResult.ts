//-----------------------------------------------------------------------------
/**
 * Game_ActionResult
 * 
 * The game object class for a result of a battle action. For convinience, all
 * member variables in this class are public.
*/
export class Game_ActionResult {
    used: boolean;
    missed: boolean;
    evaded: boolean;
    physical: boolean;
    drain: boolean;
    critical: boolean;
    success: boolean;
    hpAffected: boolean;
    hpDamage: number;
    mpDamage: number;
    tpDamage: number;
    addedStates: number[];
    removedStates: number[];
    addedBuffs: number[];
    addedDebuffs: number[];
    removedBuffs: number[];
    constructor(...args: any[]) {
        this.initialize(...args);
    }

    public initialize(...args) {
        this.clear();
    }

    public clear() {
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

    public addedStateObjects() {
        return this.addedStates.map(id => $dataStates[id]);
    }

    public removedStateObjects() {
        return this.removedStates.map(id => $dataStates[id]);
    }

    public isStatusAffected() {
        return (
            this.addedStates.length > 0 ||
            this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 ||
            this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0
        );
    }

    public isHit() {
        return this.used && !this.missed && !this.evaded;
    }

    public isStateAdded(stateId) {
        return this.addedStates.includes(stateId);
    }

    public pushAddedState(stateId) {
        if (!this.isStateAdded(stateId)) {
            this.addedStates.push(stateId);
        }
    }

    public isStateRemoved(stateId) {
        return this.removedStates.includes(stateId);
    }

    public pushRemovedState(stateId) {
        if (!this.isStateRemoved(stateId)) {
            this.removedStates.push(stateId);
        }
    }

    public isBuffAdded(paramId) {
        return this.addedBuffs.includes(paramId);
    }

    public pushAddedBuff(paramId) {
        if (!this.isBuffAdded(paramId)) {
            this.addedBuffs.push(paramId);
        }
    }

    public isDebuffAdded(paramId) {
        return this.addedDebuffs.includes(paramId);
    }

    public pushAddedDebuff(paramId) {
        if (!this.isDebuffAdded(paramId)) {
            this.addedDebuffs.push(paramId);
        }
    }

    public isBuffRemoved(paramId) {
        return this.removedBuffs.includes(paramId);
    }

    public pushRemovedBuff(paramId) {
        if (!this.isBuffRemoved(paramId)) {
            this.removedBuffs.push(paramId);
        }
    }
}
