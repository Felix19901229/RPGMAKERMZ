
//-----------------------------------------------------------------------------
/**
 * TextManager
 * 
 *  The static class that handles terms and messages.
*/
export class TextManager {
    static get currencyUnit() {
        return $dataSystem.currencyUnit;
    }
    static get level() {
        return this.basic(0);
    }

    static get levelA() {
        return this.basic(1);
    }

    static get hp() {
        return this.basic(2);
    }

    static get hpA() {
        return this.basic(3);
    }

    static get mp() {
        return this.basic(4);
    }

    static get mpA() {
        return this.basic(5);
    }

    static get tp() {
        return this.basic(6);
    }

    static get tpA() {
        return this.basic(7);
    }

    static get exp() {
        return this.basic(8);
    }

    static get expA() {
        return this.basic(9);
    }

    static get fight() {
        return this.command(0);
    }

    static get escape() {
        return this.command(1);
    }

    static get attack() {
        return this.command(2);
    }

    static get guard() {
        return this.command(3);
    }

    static get item() {
        return this.command(4);
    }

    static get skill() {
        return this.command(5);
    }

    static get equip() {
        return this.command(6);
    }

    static get status() {
        return this.command(7);
    }

    static get formation() {
        return this.command(8);
    }

    static get save() {
        return this.command(9);
    }

    static get gameEnd() {
        return this.command(10);
    }

    static get options() {
        return this.command(11);
    }

    static get weapon() {
        return this.command(12);
    }

    static get armor() {
        return this.command(13);
    }

    static get keyItem() {
        return this.command(14);
    }

    static get equip2() {
        return this.command(15);
    }

    static get optimize() {
        return this.command(16);
    }

    static get clear() {
        return this.command(17);
    }

    static get newGame() {
        return this.command(18);
    }

    static get continue_() {
        return this.command(19);
    }

    static get toTitle() {
        return this.command(21);
    }

    static get cancel() {
        return this.command(22);
    }

    static get buy() {
        return this.command(24);
    }

    static get sell() {
        return this.command(25);
    }

    static get alwaysDash() {
        return this.message("alwaysDash");
    }

    static get commandRemember() {
        return this.message("commandRemember");
    }

    static get touchUI() {
        return this.message("touchUI");
    }

    static get bgmVolume() {
        return this.message("bgmVolume");
    }

    static get bgsVolume() {
        return this.message("bgsVolume");
    }

    static get meVolume() {
        return this.message("meVolume");
    }

    static get seVolume() {
        return this.message("seVolume");
    }

    static get possession() {
        return this.message("possession");
    }

    static get expTotal() {
        return this.message("expTotal");
    }

    static get expNext() {
        return this.message("expNext");
    }

    static get saveMessage() {
        return this.message("saveMessage");
    }

    static get loadMessage() {
        return this.message("loadMessage");
    }

    static get file() {
        return this.message("file");
    }

    static get autosave() {
        return this.message("autosave");
    }

    static get partyName() {
        return this.message("partyName");
    }

    static get emerge() {
        return this.message("emerge");
    }

    static get preemptive() {
        return this.message("preemptive");
    }

    static get surprise() {
        return this.message("surprise");
    }

    static get escapeStart() {
        return this.message("escapeStart");
    }

    static get escapeFailure() {
        return this.message("escapeFailure");
    }

    static get victory() {
        return this.message("victory");
    }

    static get defeat() {
        return this.message("defeat");
    }

    static get obtainExp() {
        return this.message("obtainExp");
    }

    static get obtainGold() {
        return this.message("obtainGold");
    }

    static get obtainItem() {
        return this.message("obtainItem");
    }

    static get levelUp() {
        return this.message("levelUp");
    }

    static get obtainSkill() {
        return this.message("obtainSkill");
    }

    static get useItem() {
        return this.message("useItem");
    }

    static get criticalToEnemy() {
        return this.message("criticalToEnemy");
    }

    static get criticalToActor() {
        return this.message("criticalToActor");
    }

    static get actorDamage() {
        return this.message("actorDamage");
    }

    static get actorRecovery() {
        return this.message("actorRecovery");
    }

    static get actorGain() {
        return this.message("actorGain");
    }

    static get actorLoss() {
        return this.message("actorLoss");
    }

    static get actorDrain() {
        return this.message("actorDrain");
    }

    static get actorNoDamage() {
        return this.message("actorNoDamage");
    }

    static get actorNoHit() {
        return this.message("actorNoHit");
    }

    static get enemyDamage() {
        return this.message("enemyDamage");
    }

    static get enemyRecovery() {
        return this.message("enemyRecovery");
    }

    static get enemyGain() {
        return this.message("enemyGain");
    }

    static get enemyLoss() {
        return this.message("enemyLoss");
    }

    static get enemyDrain() {
        return this.message("enemyDrain");
    }

    static get enemyNoDamage() {
        return this.message("enemyNoDamage");
    }

    static get enemyNoHit() {
        return this.message("enemyNoHit");
    }

    static get evasion() {
        return this.message("evasion");
    }

    static get magicEvasion() {
        return this.message("magicEvasion");
    }

    static get magicReflection() {
        return this.message("magicReflection");
    }

    static get counterAttack() {
        return this.message("counterAttack");
    }

    static get substitute() {
        return this.message("substitute");
    }

    static get buffAdd() {
        return this.message("buffAdd");
    }

    static get debuffAdd() {
        return this.message("debuffAdd");
    }

    static get buffRemove() {
        return this.message("buffRemove");
    }

    static get actionFailure() {
        return this.message("actionFailure")
    }

    constructor() {
        throw new Error("This is a static class");
    }

    static basic(basicId:number) {
        return $dataSystem.terms.basic[basicId] || "";
    };

    static param(paramId:number) {
        return $dataSystem.terms.params[paramId] || "";
    };

    static command(commandId:number) {
        return $dataSystem.terms.commands[commandId] || "";
    };

    static message(messageId:string):string {
        return $dataSystem.terms.messages[messageId] || "";
    };

    static getter(method, param) {
        return {
            get: function () {
                return this[method](param);
            },
            configurable: true
        };
    };
}

// Object.defineProperties(TextManager, {
//     level: TextManager.getter("basic", 0),
//     levelA: TextManager.getter("basic", 1),
//     hp: TextManager.getter("basic", 2),
//     hpA: TextManager.getter("basic", 3),
//     mp: TextManager.getter("basic", 4),
//     mpA: TextManager.getter("basic", 5),
//     tp: TextManager.getter("basic", 6),
//     tpA: TextManager.getter("basic", 7),
//     exp: TextManager.getter("basic", 8),
//     expA: TextManager.getter("basic", 9),
//     fight: TextManager.getter("command", 0),
//     escape: TextManager.getter("command", 1),
//     attack: TextManager.getter("command", 2),
//     guard: TextManager.getter("command", 3),
//     item: TextManager.getter("command", 4),
//     skill: TextManager.getter("command", 5),
//     equip: TextManager.getter("command", 6),
//     status: TextManager.getter("command", 7),
//     formation: TextManager.getter("command", 8),
//     save: TextManager.getter("command", 9),
//     gameEnd: TextManager.getter("command", 10),
//     options: TextManager.getter("command", 11),
//     weapon: TextManager.getter("command", 12),
//     armor: TextManager.getter("command", 13),
//     keyItem: TextManager.getter("command", 14),
//     equip2: TextManager.getter("command", 15),
//     optimize: TextManager.getter("command", 16),
//     clear: TextManager.getter("command", 17),
//     newGame: TextManager.getter("command", 18),
//     continue_: TextManager.getter("command", 19),
//     toTitle: TextManager.getter("command", 21),
//     cancel: TextManager.getter("command", 22),
//     buy: TextManager.getter("command", 24),
//     sell: TextManager.getter("command", 25),
//     alwaysDash: TextManager.getter("message", "alwaysDash"),
//     commandRemember: TextManager.getter("message", "commandRemember"),
//     touchUI: TextManager.getter("message", "touchUI"),
//     bgmVolume: TextManager.getter("message", "bgmVolume"),
//     bgsVolume: TextManager.getter("message", "bgsVolume"),
//     meVolume: TextManager.getter("message", "meVolume"),
//     seVolume: TextManager.getter("message", "seVolume"),
//     possession: TextManager.getter("message", "possession"),
//     expTotal: TextManager.getter("message", "expTotal"),
//     expNext: TextManager.getter("message", "expNext"),
//     saveMessage: TextManager.getter("message", "saveMessage"),
//     loadMessage: TextManager.getter("message", "loadMessage"),
//     file: TextManager.getter("message", "file"),
//     autosave: TextManager.getter("message", "autosave"),
//     partyName: TextManager.getter("message", "partyName"),
//     emerge: TextManager.getter("message", "emerge"),
//     preemptive: TextManager.getter("message", "preemptive"),
//     surprise: TextManager.getter("message", "surprise"),
//     escapeStart: TextManager.getter("message", "escapeStart"),
//     escapeFailure: TextManager.getter("message", "escapeFailure"),
//     victory: TextManager.getter("message", "victory"),
//     defeat: TextManager.getter("message", "defeat"),
//     obtainExp: TextManager.getter("message", "obtainExp"),
//     obtainGold: TextManager.getter("message", "obtainGold"),
//     obtainItem: TextManager.getter("message", "obtainItem"),
//     levelUp: TextManager.getter("message", "levelUp"),
//     obtainSkill: TextManager.getter("message", "obtainSkill"),
//     useItem: TextManager.getter("message", "useItem"),
//     criticalToEnemy: TextManager.getter("message", "criticalToEnemy"),
//     criticalToActor: TextManager.getter("message", "criticalToActor"),
//     actorDamage: TextManager.getter("message", "actorDamage"),
//     actorRecovery: TextManager.getter("message", "actorRecovery"),
//     actorGain: TextManager.getter("message", "actorGain"),
//     actorLoss: TextManager.getter("message", "actorLoss"),
//     actorDrain: TextManager.getter("message", "actorDrain"),
//     actorNoDamage: TextManager.getter("message", "actorNoDamage"),
//     actorNoHit: TextManager.getter("message", "actorNoHit"),
//     enemyDamage: TextManager.getter("message", "enemyDamage"),
//     enemyRecovery: TextManager.getter("message", "enemyRecovery"),
//     enemyGain: TextManager.getter("message", "enemyGain"),
//     enemyLoss: TextManager.getter("message", "enemyLoss"),
//     enemyDrain: TextManager.getter("message", "enemyDrain"),
//     enemyNoDamage: TextManager.getter("message", "enemyNoDamage"),
//     enemyNoHit: TextManager.getter("message", "enemyNoHit"),
//     evasion: TextManager.getter("message", "evasion"),
//     magicEvasion: TextManager.getter("message", "magicEvasion"),
//     magicReflection: TextManager.getter("message", "magicReflection"),
//     counterAttack: TextManager.getter("message", "counterAttack"),
//     substitute: TextManager.getter("message", "substitute"),
//     buffAdd: TextManager.getter("message", "buffAdd"),
//     debuffAdd: TextManager.getter("message", "debuffAdd"),
//     buffRemove: TextManager.getter("message", "buffRemove"),
//     actionFailure: TextManager.getter("message", "actionFailure")
// });
