import { AudioManager } from "../Manager/index.js";
import { Graphics } from "../Core/index.js";
export class Game_System {
    _saveEnabled;
    _menuEnabled;
    _encounterEnabled;
    _formationEnabled;
    _battleCount;
    _winCount;
    _escapeCount;
    _saveCount;
    _versionId;
    _savefileId;
    _framesOnSave;
    _bgmOnSave;
    _bgsOnSave;
    _windowTone;
    _battleBgm;
    _victoryMe;
    _defeatMe;
    _savedBgm;
    _walkingBgm;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(...args) {
        this._saveEnabled = true;
        this._menuEnabled = true;
        this._encounterEnabled = true;
        this._formationEnabled = true;
        this._battleCount = 0;
        this._winCount = 0;
        this._escapeCount = 0;
        this._saveCount = 0;
        this._versionId = 0;
        this._savefileId = 0;
        this._framesOnSave = 0;
        this._bgmOnSave = null;
        this._bgsOnSave = null;
        this._windowTone = null;
        this._battleBgm = null;
        this._victoryMe = null;
        this._defeatMe = null;
        this._savedBgm = null;
        this._walkingBgm = null;
    }
    isJapanese() {
        return window.$dataSystem.locale.match(/^ja/);
    }
    isChinese() {
        return window.$dataSystem.locale.match(/^zh/);
    }
    isKorean() {
        return window.$dataSystem.locale.match(/^ko/);
    }
    isCJK() {
        return window.$dataSystem.locale.match(/^(ja|zh|ko)/);
    }
    isRussian() {
        return window.$dataSystem.locale.match(/^ru/);
    }
    isSideView() {
        return window.$dataSystem.optSideView;
    }
    isAutosaveEnabled() {
        return window.$dataSystem.optAutosave;
    }
    isSaveEnabled() {
        return this._saveEnabled;
    }
    disableSave() {
        this._saveEnabled = false;
    }
    enableSave() {
        this._saveEnabled = true;
    }
    isMenuEnabled() {
        return this._menuEnabled;
    }
    disableMenu() {
        this._menuEnabled = false;
    }
    enableMenu() {
        this._menuEnabled = true;
    }
    isEncounterEnabled() {
        return this._encounterEnabled;
    }
    disableEncounter() {
        this._encounterEnabled = false;
    }
    enableEncounter() {
        this._encounterEnabled = true;
    }
    isFormationEnabled() {
        return this._formationEnabled;
    }
    disableFormation() {
        this._formationEnabled = false;
    }
    enableFormation() {
        this._formationEnabled = true;
    }
    battleCount() {
        return this._battleCount;
    }
    winCount() {
        return this._winCount;
    }
    escapeCount() {
        return this._escapeCount;
    }
    saveCount() {
        return this._saveCount;
    }
    versionId() {
        return this._versionId;
    }
    savefileId() {
        return this._savefileId || 0;
    }
    setSavefileId(savefileId) {
        this._savefileId = savefileId;
    }
    windowTone() {
        return this._windowTone || window.$dataSystem.windowTone;
    }
    setWindowTone(value) {
        this._windowTone = value;
    }
    battleBgm() {
        return this._battleBgm || window.$dataSystem.battleBgm;
    }
    setBattleBgm(value) {
        this._battleBgm = value;
    }
    victoryMe() {
        return this._victoryMe || window.$dataSystem.victoryMe;
    }
    setVictoryMe(value) {
        this._victoryMe = value;
    }
    defeatMe() {
        return this._defeatMe || window.$dataSystem.defeatMe;
    }
    setDefeatMe(value) {
        this._defeatMe = value;
    }
    onBattleStart() {
        this._battleCount++;
    }
    onBattleWin() {
        this._winCount++;
    }
    onBattleEscape() {
        this._escapeCount++;
    }
    onBeforeSave() {
        this._saveCount++;
        this._versionId = window.$dataSystem.versionId;
        this._framesOnSave = Graphics.frameCount;
        this._bgmOnSave = AudioManager.saveBgm();
        this._bgsOnSave = AudioManager.saveBgs();
    }
    onAfterLoad() {
        Graphics.frameCount = this._framesOnSave;
        AudioManager.playBgm(this._bgmOnSave);
        AudioManager.playBgs(this._bgsOnSave);
    }
    playtime() {
        return Math.floor(Graphics.frameCount / 60);
    }
    playtimeText() {
        const hour = Math.floor(this.playtime() / 60 / 60);
        const min = Math.floor(this.playtime() / 60) % 60;
        const sec = this.playtime() % 60;
        return hour.padZero(2) + ":" + min.padZero(2) + ":" + sec.padZero(2);
    }
    saveBgm() {
        this._savedBgm = AudioManager.saveBgm();
    }
    replayBgm() {
        if (this._savedBgm) {
            AudioManager.replayBgm(this._savedBgm);
        }
    }
    saveWalkingBgm() {
        this._walkingBgm = AudioManager.saveBgm();
    }
    replayWalkingBgm() {
        if (this._walkingBgm) {
            AudioManager.playBgm(this._walkingBgm);
        }
    }
    saveWalkingBgm2() {
        this._walkingBgm = window.$dataMap.bgm;
    }
    mainFontFace() {
        return "rmmz-mainfont, " + window.$dataSystem.advanced.fallbackFonts;
    }
    numberFontFace() {
        return "rmmz-numberfont, " + this.mainFontFace();
    }
    mainFontSize() {
        return window.$dataSystem.advanced.fontSize;
    }
    windowPadding() {
        return 12;
    }
    windowOpacity() {
        if ("windowOpacity" in window.$dataSystem.advanced) {
            return window.$dataSystem.advanced.windowOpacity;
        }
        else {
            return 192;
        }
    }
    ;
}
