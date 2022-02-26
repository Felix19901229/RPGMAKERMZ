import { Game_Actors, Game_Map, Game_Message, Game_Party, Game_Player, Game_Screen, Game_SelfSwitches, Game_Switches, Game_System, Game_Temp, Game_Timer, Game_Troop, Game_Variables } from "../Game/index.js";
import { Graphics, Utils } from "../Core/index.js";
import { BattleManager, ImageManager, StorageManager } from "../Manager/index.js";
export class DataManager {
    static _globalInfo = null;
    static _errors = [];
    static _databaseFiles = [
        { name: "$dataActors", src: "Actors.json" },
        { name: "$dataClasses", src: "Classes.json" },
        { name: "$dataSkills", src: "Skills.json" },
        { name: "$dataItems", src: "Items.json" },
        { name: "$dataWeapons", src: "Weapons.json" },
        { name: "$dataArmors", src: "Armors.json" },
        { name: "$dataEnemies", src: "Enemies.json" },
        { name: "$dataTroops", src: "Troops.json" },
        { name: "$dataStates", src: "States.json" },
        { name: "$dataAnimations", src: "Animations.json" },
        { name: "$dataTilesets", src: "Tilesets.json" },
        { name: "$dataCommonEvents", src: "CommonEvents.json" },
        { name: "$dataSystem", src: "System.json" },
        { name: "$dataMapInfos", src: "MapInfos.json" }
    ];
    constructor() {
        throw new Error("This is a static class");
    }
    static loadGlobalInfo() {
        StorageManager.loadObject("global")
            .then(globalInfo => {
            this._globalInfo = globalInfo;
            this.removeInvalidGlobalInfo();
            return 0;
        })
            .catch(() => {
            this._globalInfo = [];
        });
    }
    static removeInvalidGlobalInfo() {
        const globalInfo = this._globalInfo;
        for (const info of globalInfo) {
            const savefileId = globalInfo.indexOf(info);
            if (!this.savefileExists(savefileId)) {
                delete globalInfo[savefileId];
            }
        }
    }
    static saveGlobalInfo() {
        StorageManager.saveObject("global", this._globalInfo);
    }
    static isGlobalInfoLoaded() {
        return !!this._globalInfo;
    }
    static loadDatabase() {
        const test = this.isBattleTest() || this.isEventTest();
        const prefix = test ? "Test_" : "";
        for (const databaseFile of this._databaseFiles) {
            this.loadDataFile(databaseFile.name, prefix + databaseFile.src);
        }
        if (this.isEventTest()) {
            this.loadDataFile("$testEvent", prefix + "Event.json");
        }
    }
    static loadDataFile(name, src) {
        const xhr = new XMLHttpRequest();
        const url = "data/" + src;
        window[name] = null;
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
        xhr.onerror = () => this.onXhrError(name, src, url);
        xhr.send();
    }
    static onXhrLoad(xhr, name, src, url) {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            this.onLoad(window[name]);
        }
        else {
            this.onXhrError(name, src, url);
        }
    }
    static onXhrError(name, src, url) {
        const error = { name: name, src: src, url: url };
        this._errors.push(error);
    }
    static isDatabaseLoaded() {
        this.checkError();
        for (const databaseFile of this._databaseFiles) {
            if (!window[databaseFile.name]) {
                return false;
            }
        }
        return true;
    }
    static loadMapData(mapId) {
        if (mapId > 0) {
            const filename = "Map%1.json".format(mapId.padZero(3));
            this.loadDataFile("$dataMap", filename);
        }
        else {
            this.makeEmptyMap();
        }
    }
    static makeEmptyMap() {
        window.$dataMap = {};
        window.$dataMap.data = [];
        window.$dataMap.events = [];
        window.$dataMap.width = 100;
        window.$dataMap.height = 100;
        window.$dataMap.scrollType = 3;
    }
    static isMapLoaded() {
        this.checkError();
        return !!window.$dataMap;
    }
    static onLoad(object) {
        if (this.isMapObject(object)) {
            this.extractMetadata(object);
            this.extractArrayMetadata(object.events);
        }
        else {
            this.extractArrayMetadata(object);
        }
    }
    static isMapObject(object) {
        return !!(object.data && object.events);
    }
    static extractArrayMetadata(array) {
        if (Array.isArray(array)) {
            for (const data of array) {
                if (data && "note" in data) {
                    this.extractMetadata(data);
                }
            }
        }
    }
    static extractMetadata(data) {
        const regExp = /<([^<>:]+)(:?)([^>]*)>/g;
        data.meta = {};
        for (;;) {
            const match = regExp.exec(data.note);
            if (match) {
                if (match[2] === ":") {
                    data.meta[match[1]] = match[3];
                }
                else {
                    data.meta[match[1]] = true;
                }
            }
            else {
                break;
            }
        }
    }
    static checkError() {
        if (this._errors.length > 0) {
            const error = this._errors.shift();
            const retry = () => {
                this.loadDataFile(error.name, error.src);
            };
            throw ["LoadError", error.url, retry];
        }
    }
    static isBattleTest() {
        return Utils.isOptionValid("btest");
    }
    static isEventTest() {
        return Utils.isOptionValid("etest");
    }
    static isSkill(item) {
        return item && window.$dataSkills.includes(item);
    }
    static isItem(item) {
        return item && window.$dataItems.includes(item);
    }
    static isWeapon(item) {
        return item && window.$dataWeapons.includes(item);
    }
    static isArmor(item) {
        return item && window.$dataArmors.includes(item);
    }
    static createGameObjects() {
        window.$gameTemp = new Game_Temp();
        window.$gameSystem = new Game_System();
        window.$gameScreen = new Game_Screen();
        window.$gameTimer = new Game_Timer();
        window.$gameMessage = new Game_Message();
        window.$gameSwitches = new Game_Switches();
        window.$gameVariables = new Game_Variables();
        window.$gameSelfSwitches = new Game_SelfSwitches();
        window.$gameActors = new Game_Actors();
        window.$gameParty = new Game_Party();
        window.$gameTroop = new Game_Troop();
        window.$gameMap = new Game_Map();
        window.$gamePlayer = new Game_Player();
    }
    static setupNewGame() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        window.$gameParty.setupStartingMembers();
        window.$gamePlayer.setupForNewGame();
        Graphics.frameCount = 0;
    }
    static setupBattleTest() {
        this.createGameObjects();
        window.$gameParty.setupBattleTest();
        BattleManager.setup(window.$dataSystem.testTroopId, true, false);
        BattleManager.setBattleTest(true);
        BattleManager.playBattleBgm();
    }
    static setupEventTest() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        window.$gameParty.setupStartingMembers();
        window.$gamePlayer.reserveTransfer(-1, 8, 6);
        window.$gamePlayer.setTransparent(false);
    }
    static isAnySavefileExists() {
        return this._globalInfo.some(x => x);
    }
    static latestSavefileId() {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo.slice(1).filter(x => x);
        const latest = Math.max(...validInfo.map(x => x.timestamp));
        const index = globalInfo.findIndex(x => x && x.timestamp === latest);
        return index > 0 ? index : 0;
    }
    static earliestSavefileId() {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo.slice(1).filter(x => x);
        const earliest = Math.min(...validInfo.map(x => x.timestamp));
        const index = globalInfo.findIndex(x => x && x.timestamp === earliest);
        return index > 0 ? index : 0;
    }
    static emptySavefileId() {
        const globalInfo = this._globalInfo;
        const maxSavefiles = this.maxSavefiles();
        if (globalInfo.length < maxSavefiles) {
            return Math.max(1, globalInfo.length);
        }
        else {
            const index = globalInfo.slice(1).findIndex(x => !x);
            return index >= 0 ? index + 1 : -1;
        }
    }
    static loadAllSavefileImages() {
        for (const info of this._globalInfo.filter(x => x)) {
            this.loadSavefileImages(info);
        }
    }
    static loadSavefileImages(info) {
        if (info.characters && Symbol.iterator in info.characters) {
            for (const character of info.characters) {
                ImageManager.loadCharacter(character[0]);
            }
        }
        if (info.faces && Symbol.iterator in info.faces) {
            for (const face of info.faces) {
                ImageManager.loadFace(face[0]);
            }
        }
    }
    static maxSavefiles() {
        return 20;
    }
    static savefileInfo(savefileId) {
        const globalInfo = this._globalInfo;
        return globalInfo[savefileId] ? globalInfo[savefileId] : null;
    }
    static savefileExists(savefileId) {
        const saveName = this.makeSavename(savefileId);
        return StorageManager.exists(saveName);
    }
    static saveGame(savefileId) {
        const contents = this.makeSaveContents();
        const saveName = this.makeSavename(savefileId);
        return StorageManager.saveObject(saveName, contents).then(() => {
            this._globalInfo[savefileId] = this.makeSavefileInfo();
            this.saveGlobalInfo();
            return 0;
        });
    }
    static loadGame(savefileId) {
        const saveName = this.makeSavename(savefileId);
        return StorageManager.loadObject(saveName).then(contents => {
            this.createGameObjects();
            this.extractSaveContents(contents);
            this.correctDataErrors();
            return 0;
        });
    }
    static makeSavename(savefileId) {
        return "file%1".format(savefileId);
    }
    static selectSavefileForNewGame() {
        const emptySavefileId = this.emptySavefileId();
        const earliestSavefileId = this.earliestSavefileId();
        if (emptySavefileId > 0) {
            window.$gameSystem.setSavefileId(emptySavefileId);
        }
        else {
            window.$gameSystem.setSavefileId(earliestSavefileId);
        }
    }
    static makeSavefileInfo() {
        const info = {};
        info.title = window.$dataSystem.gameTitle;
        info.characters = window.$gameParty.charactersForSavefile();
        info.faces = window.$gameParty.facesForSavefile();
        info.playtime = window.$gameSystem.playtimeText();
        info.timestamp = Date.now();
        return info;
    }
    static makeSaveContents() {
        const contents = {};
        contents.system = window.$gameSystem;
        contents.screen = window.$gameScreen;
        contents.timer = window.$gameTimer;
        contents.switches = window.$gameSwitches;
        contents.variables = window.$gameVariables;
        contents.selfSwitches = window.$gameSelfSwitches;
        contents.actors = window.$gameActors;
        contents.party = window.$gameParty;
        contents.map = window.$gameMap;
        contents.player = window.$gamePlayer;
        return contents;
    }
    static extractSaveContents(contents) {
        window.$gameSystem = contents.system;
        window.$gameScreen = contents.screen;
        window.$gameTimer = contents.timer;
        window.$gameSwitches = contents.switches;
        window.$gameVariables = contents.variables;
        window.$gameSelfSwitches = contents.selfSwitches;
        window.$gameActors = contents.actors;
        window.$gameParty = contents.party;
        window.$gameMap = contents.map;
        window.$gamePlayer = contents.player;
    }
    static correctDataErrors() {
        window.$gameParty.removeInvalidMembers();
    }
}
