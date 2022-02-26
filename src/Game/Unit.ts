import { BattleManager } from "../Manager/index.js";
//-----------------------------------------------------------------------------
/**
 * Game_Unit
 * 
 * The superclass of Game_Party and Game_Troop.
*/
export class Game_Unit {
    _inBattle: boolean;
    constructor(...args: any[]) {
        this.initialize(...args);
    }

    public initialize(...args) {
        this._inBattle = false;
    }

    public inBattle() {
        return this._inBattle;
    }

    public members() {
        return [];
    }

    public aliveMembers() {
        return this.members().filter(member => member.isAlive());
    }

    public deadMembers() {
        return this.members().filter(member => member.isDead());
    }

    public movableMembers() {
        return this.members().filter(member => member.canMove());
    }

    public clearActions() {
        for (const member of this.members()) {
            member.clearActions();
        }
    }

    public agility() {
        const members = this.members();
        const sum = members.reduce((r, member) => r + member.agi, 0);
        return Math.max(1, sum / Math.max(1, members.length));
    }

    public tgrSum() {
        return this.aliveMembers().reduce((r, member) => r + member.tgr, 0);
    }

    public randomTarget() {
        let tgrRand = Math.random() * this.tgrSum();
        let target = null;
        for (const member of this.aliveMembers()) {
            tgrRand -= member.tgr;
            if (tgrRand <= 0 && !target) {
                target = member;
            }
        }
        return target;
    }

    public randomDeadTarget() {
        const members = this.deadMembers();
        return members.length ? members[Math.randomInt(members.length)] : null;
    }

    public smoothTarget(index) {
        const member = this.members()[Math.max(0, index)];
        return member && member.isAlive() ? member : this.aliveMembers()[0];
    }

    public smoothDeadTarget(index) {
        const member = this.members()[Math.max(0, index)];
        return member && member.isDead() ? member : this.deadMembers()[0];
    }

    public clearResults() {
        for (const member of this.members()) {
            member.clearResult();
        }
    }

    public onBattleStart(advantageous) {
        for (const member of this.members()) {
            member.onBattleStart(advantageous);
        }
        this._inBattle = true;
    }

    public onBattleEnd() {
        this._inBattle = false;
        for (const member of this.members()) {
            member.onBattleEnd();
        }
    }

    public makeActions() {
        for (const member of this.members()) {
            member.makeActions();
        }
    }

    public select(activeMember) {
        for (const member of this.members()) {
            if (member === activeMember) {
                member.select();
            } else {
                member.deselect();
            }
        }
    }

    public isAllDead() {
        return this.aliveMembers().length === 0;
    }

    public substituteBattler() {
        for (const member of this.members()) {
            if (member.isSubstitute()) {
                return member;
            }
        }
        return null;
    }

    public tpbBaseSpeed() {
        const members = this.members();
        return Math.max(...members.map(member => member.tpbBaseSpeed()));
    }

    public tpbReferenceTime() {
        return BattleManager.isActiveTpb() ? 240 : 60;
    }

    public updateTpb() {
        for (const member of this.members()) {
            member.updateTpb();
        }
    }
}
