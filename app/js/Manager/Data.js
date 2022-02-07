import { Game_System, Game_Temp } from "../Game/index.js";
import { Graphics, Utils } from "../Core/index.js";
import { BattleManager, ImageManager, StorageManager } from "./index.js";
import { Game_Timer } from "../Game/Timer.js";
export class DataManager {
    static _globalInfo = null;
    static _errors = [];
    constructor() {
        throw new Error("This is a static class");
    }
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
    ;
    static removeInvalidGlobalInfo() {
        const globalInfo = this._globalInfo;
        for (const info of globalInfo) {
            const savefileId = globalInfo.indexOf(info);
            if (!this.savefileExists(savefileId)) {
                delete globalInfo[savefileId];
            }
        }
    }
    ;
    static saveGlobalInfo() {
        StorageManager.saveObject("global", this._globalInfo);
    }
    ;
    static isGlobalInfoLoaded() {
        return !!this._globalInfo;
    }
    ;
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
    ;
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
    ;
    static onXhrLoad(xhr, name, src, url) {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            this.onLoad(window[name]);
        }
        else {
            this.onXhrError(name, src, url);
        }
    }
    ;
    static onXhrError(name, src, url) {
        const error = { name: name, src: src, url: url };
        this._errors.push(error);
    }
    ;
    static isDatabaseLoaded() {
        this.checkError();
        for (const databaseFile of this._databaseFiles) {
            if (!window[databaseFile.name]) {
                return false;
            }
        }
        return true;
    }
    ;
    static loadMapData(mapId) {
        if (mapId > 0) {
            const filename = "Map%1.json".format(mapId.padZero(3));
            this.loadDataFile("$dataMap", filename);
        }
        else {
            this.makeEmptyMap();
        }
    }
    ;
    static makeEmptyMap() {
        $dataMap = {};
        $dataMap.data = [];
        $dataMap.events = [];
        $dataMap.width = 100;
        $dataMap.height = 100;
        $dataMap.scrollType = 3;
    }
    ;
    static isMapLoaded() {
        this.checkError();
        return !!$dataMap;
    }
    ;
    static onLoad(object) {
        if (this.isMapObject(object)) {
            this.extractMetadata(object);
            this.extractArrayMetadata(object.events);
        }
        else {
            this.extractArrayMetadata(object);
        }
    }
    ;
    static isMapObject(object) {
        return !!(object.data && object.events);
    }
    ;
    static extractArrayMetadata(array) {
        if (Array.isArray(array)) {
            for (const data of array) {
                if (data && "note" in data) {
                    this.extractMetadata(data);
                }
            }
        }
    }
    ;
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
    ;
    static checkError() {
        if (this._errors.length > 0) {
            const error = this._errors.shift();
            const retry = () => {
                this.loadDataFile(error.name, error.src);
            };
            throw ["LoadError", error.url, retry];
        }
    }
    ;
    static isBattleTest() {
        return Utils.isOptionValid("btest");
    }
    ;
    static isEventTest() {
        return Utils.isOptionValid("etest");
    }
    ;
    static isSkill(item) {
        return item && $dataSkills.includes(item);
    }
    ;
    static isItem(item) {
        return item && $dataItems.includes(item);
    }
    ;
    static isWeapon(item) {
        return item && $dataWeapons.includes(item);
    }
    ;
    static isArmor(item) {
        return item && $dataArmors.includes(item);
    }
    ;
    static createGameObjects() {
        $gameTemp = new Game_Temp();
        $gameSystem = new Game_System();
        $gameScreen = new Game_Screen();
        $gameTimer = new Game_Timer();
        $gameMessage = new Game_Message();
        $gameSwitches = new Game_Switches();
        $gameVariables = new Game_Variables();
        $gameSelfSwitches = new Game_SelfSwitches();
        $gameActors = new Game_Actors();
        $gameParty = new Game_Party();
        $gameTroop = new Game_Troop();
        $gameMap = new Game_Map();
        $gamePlayer = new Game_Player();
    }
    ;
    static setupNewGame() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.setupForNewGame();
        Graphics.frameCount = 0;
    }
    ;
    static setupBattleTest() {
        this.createGameObjects();
        $gameParty.setupBattleTest();
        BattleManager.setup($dataSystem.testTroopId, true, false);
        BattleManager.setBattleTest(true);
        BattleManager.playBattleBgm();
    }
    ;
    static setupEventTest() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer(-1, 8, 6);
        $gamePlayer.setTransparent(false);
    }
    ;
    static isAnySavefileExists() {
        return this._globalInfo.some(x => x);
    }
    ;
    static latestSavefileId() {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo.slice(1).filter(x => x);
        const latest = Math.max(...validInfo.map(x => x.timestamp));
        const index = globalInfo.findIndex(x => x && x.timestamp === latest);
        return index > 0 ? index : 0;
    }
    ;
    static earliestSavefileId() {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo.slice(1).filter(x => x);
        const earliest = Math.min(...validInfo.map(x => x.timestamp));
        const index = globalInfo.findIndex(x => x && x.timestamp === earliest);
        return index > 0 ? index : 0;
    }
    ;
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
    ;
    static loadAllSavefileImages() {
        for (const info of this._globalInfo.filter(x => x)) {
            this.loadSavefileImages(info);
        }
    }
    ;
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
    ;
    static maxSavefiles() {
        return 20;
    }
    ;
    static savefileInfo(savefileId) {
        const globalInfo = this._globalInfo;
        return globalInfo[savefileId] ? globalInfo[savefileId] : null;
    }
    ;
    static savefileExists(savefileId) {
        const saveName = this.makeSavename(savefileId);
        return StorageManager.exists(saveName);
    }
    ;
    static saveGame(savefileId) {
        const contents = this.makeSaveContents();
        const saveName = this.makeSavename(savefileId);
        return StorageManager.saveObject(saveName, contents).then(() => {
            this._globalInfo[savefileId] = this.makeSavefileInfo();
            this.saveGlobalInfo();
            return 0;
        });
    }
    ;
    static loadGame(savefileId) {
        const saveName = this.makeSavename(savefileId);
        return StorageManager.loadObject(saveName).then(contents => {
            this.createGameObjects();
            this.extractSaveContents(contents);
            this.correctDataErrors();
            return 0;
        });
    }
    ;
    static makeSavename(savefileId) {
        return "file%1".format(savefileId);
    }
    ;
    static selectSavefileForNewGame() {
        const emptySavefileId = this.emptySavefileId();
        const earliestSavefileId = this.earliestSavefileId();
        if (emptySavefileId > 0) {
            $gameSystem.setSavefileId(emptySavefileId);
        }
        else {
            $gameSystem.setSavefileId(earliestSavefileId);
        }
    }
    ;
    static makeSavefileInfo() {
        const info = {};
        info.title = $dataSystem.gameTitle;
        info.characters = $gameParty.charactersForSavefile();
        info.faces = $gameParty.facesForSavefile();
        info.playtime = $gameSystem.playtimeText();
        info.timestamp = Date.now();
        return info;
    }
    ;
    static makeSaveContents() {
        const contents = {};
        contents.system = $gameSystem;
        contents.screen = $gameScreen;
        contents.timer = $gameTimer;
        contents.switches = $gameSwitches;
        contents.variables = $gameVariables;
        contents.selfSwitches = $gameSelfSwitches;
        contents.actors = $gameActors;
        contents.party = $gameParty;
        contents.map = $gameMap;
        contents.player = $gamePlayer;
        return contents;
    }
    ;
    static extractSaveContents(contents) {
        $gameSystem = contents.system;
        $gameScreen = contents.screen;
        $gameTimer = contents.timer;
        $gameSwitches = contents.switches;
        $gameVariables = contents.variables;
        $gameSelfSwitches = contents.selfSwitches;
        $gameActors = contents.actors;
        $gameParty = contents.party;
        $gameMap = contents.map;
        $gamePlayer = contents.player;
    }
    ;
    static correctDataErrors() {
        $gameParty.removeInvalidMembers();
    }
    ;
}
