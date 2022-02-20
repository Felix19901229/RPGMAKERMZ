export class Game_Unit {
    _inBattle;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(...args) {
        this._inBattle = false;
    }
    inBattle() {
        return this._inBattle;
    }
    members() {
        return [];
    }
    aliveMembers() {
        return this.members().filter(member => member.isAlive());
    }
    deadMembers() {
        return this.members().filter(member => member.isDead());
    }
    movableMembers() {
        return this.members().filter(member => member.canMove());
    }
    clearActions() {
        for (const member of this.members()) {
            member.clearActions();
        }
    }
    agility() {
        const members = this.members();
        const sum = members.reduce((r, member) => r + member.agi, 0);
        return Math.max(1, sum / Math.max(1, members.length));
    }
    tgrSum() {
        return this.aliveMembers().reduce((r, member) => r + member.tgr, 0);
    }
    randomTarget() {
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
    randomDeadTarget() {
        const members = this.deadMembers();
        return members.length ? members[Math.randomInt(members.length)] : null;
    }
    smoothTarget(index) {
        const member = this.members()[Math.max(0, index)];
        return member && member.isAlive() ? member : this.aliveMembers()[0];
    }
    smoothDeadTarget(index) {
        const member = this.members()[Math.max(0, index)];
        return member && member.isDead() ? member : this.deadMembers()[0];
    }
    clearResults() {
        for (const member of this.members()) {
            member.clearResult();
        }
    }
    onBattleStart(advantageous) {
        for (const member of this.members()) {
            member.onBattleStart(advantageous);
        }
        this._inBattle = true;
    }
    onBattleEnd() {
        this._inBattle = false;
        for (const member of this.members()) {
            member.onBattleEnd();
        }
    }
    makeActions() {
        for (const member of this.members()) {
            member.makeActions();
        }
    }
    select(activeMember) {
        for (const member of this.members()) {
            if (member === activeMember) {
                member.select();
            }
            else {
                member.deselect();
            }
        }
    }
    isAllDead() {
        return this.aliveMembers().length === 0;
    }
    substituteBattler() {
        for (const member of this.members()) {
            if (member.isSubstitute()) {
                return member;
            }
        }
        return null;
    }
    tpbBaseSpeed() {
        const members = this.members();
        return Math.max(...members.map(member => member.tpbBaseSpeed()));
    }
    tpbReferenceTime() {
        return BattleManager.isActiveTpb() ? 240 : 60;
    }
    updateTpb() {
        for (const member of this.members()) {
            member.updateTpb();
        }
    }
}
