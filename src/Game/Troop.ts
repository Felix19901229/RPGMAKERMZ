import { Game_Enemy, Game_Unit ,Game_Interpreter } from "./index.js";
declare const BattleManager:any;
declare const $dataTroops:any;
declare const $dataEnemies:any;
declare const $gameSystem:any;
declare const $gameTroop:any;
declare const $gameActors:any;
declare const $gameSwitches:any;
declare const $gameParty:any;
//-----------------------------------------------------------------------------
/**
 * Game_Troop
 * 
 * The game object class for a troop and the battle-related data.
*/
export class Game_Troop extends Game_Unit {
    static LETTER_TABLE_HALF = [
        " A", " B", " C", " D", " E", " F", " G", " H", " I", " J", " K", " L", " M",
        " N", " O", " P", " Q", " R", " S", " T", " U", " V", " W", " X", " Y", " Z"
    ];

    static LETTER_TABLE_FULL = [
        "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ",
        "Ｎ", "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ"
    ];
    _interpreter: Game_Interpreter;
    _turnCount: any;
    _enemies: any;
    _troopId: number;
    _eventFlags: {}
    _namesCount: {}

    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);

    }



    public initialize(...args) {
        Game_Unit.prototype.initialize.call(this);
        this._interpreter = new Game_Interpreter();
        this.clear();
    }

    public isEventRunning() {
        return this._interpreter.isRunning();
    }

    public updateInterpreter() {
        this._interpreter.update();
    }

    public turnCount() {
        return this._turnCount;
    }

    public members() {
        return this._enemies;
    }

    public clear() {
        this._interpreter.clear();
        this._troopId = 0;
        this._eventFlags = {}
        this._enemies = [];
        this._turnCount = 0;
        this._namesCount = {}
    }

    public troop() {
        return $dataTroops[this._troopId];
    }

    public setup(troopId) {
        this.clear();
        this._troopId = troopId;
        this._enemies = [];
        for (const member of this.troop().members) {
            if ($dataEnemies[member.enemyId]) {
                const enemyId = member.enemyId;
                const x = member.x;
                const y = member.y;
                const enemy = new Game_Enemy(enemyId, x, y);
                if (member.hidden) {
                    enemy.hide();
                }
                this._enemies.push(enemy);
            }
        }
        this.makeUniqueNames();
    }

    public makeUniqueNames() {
        const table = this.letterTable();
        for (const enemy of this.members()) {
            if (enemy.isAlive() && enemy.isLetterEmpty()) {
                const name = enemy.originalName();
                const n = this._namesCount[name] || 0;
                enemy.setLetter(table[n % table.length]);
                this._namesCount[name] = n + 1;
            }
        }
        this.updatePluralFlags();
    }

    public updatePluralFlags() {
        for (const enemy of this.members()) {
            const name = enemy.originalName();
            if (this._namesCount[name] >= 2) {
                enemy.setPlural(true);
            }
        }
    }

    public letterTable() {
        return $gameSystem.isCJK()
            ? Game_Troop.LETTER_TABLE_FULL
            : Game_Troop.LETTER_TABLE_HALF;
    }

    public enemyNames() {
        const names = [];
        for (const enemy of this.members()) {
            const name = enemy.originalName();
            if (enemy.isAlive() && !names.includes(name)) {
                names.push(name);
            }
        }
        return names;
    }

    public meetsConditions(page) {
        const c = page.conditions;
        if (
            !c.turnEnding &&
            !c.turnValid &&
            !c.enemyValid &&
            !c.actorValid &&
            !c.switchValid
        ) {
            return false; // Conditions not set
        }
        if (c.turnEnding) {
            if (!BattleManager.isTurnEnd()) {
                return false;
            }
        }
        if (c.turnValid) {
            const n = this._turnCount;
            const a = c.turnA;
            const b = c.turnB;
            if (b === 0 && n !== a) {
                return false;
            }
            if (b > 0 && (n < 1 || n < a || n % b !== a % b)) {
                return false;
            }
        }
        if (c.enemyValid) {
            const enemy = $gameTroop.members()[c.enemyIndex];
            if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
                return false;
            }
        }
        if (c.actorValid) {
            const actor = $gameActors.actor(c.actorId);
            if (!actor || actor.hpRate() * 100 > c.actorHp) {
                return false;
            }
        }
        if (c.switchValid) {
            if (!$gameSwitches.value(c.switchId)) {
                return false;
            }
        }
        return true;
    }

    public setupBattleEvent() {
        if (!this._interpreter.isRunning()) {
            if (this._interpreter.setupReservedCommonEvent()) {
                return;
            }
            const pages = this.troop().pages;
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (this.meetsConditions(page) && !this._eventFlags[i]) {
                    this._interpreter.setup(page.list);
                    if (page.span <= 1) {
                        this._eventFlags[i] = true;
                    }
                    break;
                }
            }
        }
    }

    public increaseTurn() {
        const pages = this.troop().pages;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (page.span === 1) {
                this._eventFlags[i] = false;
            }
        }
        this._turnCount++;
    }

    public expTotal() {
        return this.deadMembers().reduce((r, enemy) => r + enemy.exp(), 0);
    }

    public goldTotal() {
        const members = this.deadMembers();
        return members.reduce((r, enemy) => r + enemy.gold(), 0) * this.goldRate();
    }

    public goldRate() {
        return $gameParty.hasGoldDouble() ? 2 : 1;
    }

    public makeDropItems() {
        const members = this.deadMembers();
        return members.reduce((r, enemy) => r.concat(enemy.makeDropItems()), []);
    }

    public isTpbTurnEnd() {
        const members = this.members();
        const turnMax = Math.max(...members.map(member => member.turnCount()));
        return turnMax > this._turnCount;
    }

}
