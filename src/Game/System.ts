import { AudioManager } from "../Manager/index.js";
import { Graphics } from "../Core/index.js";

//-----------------------------------------------------------------------------
/**
 * Game_System
 * 
 * The game object class for the system data.
*/
export class Game_System {
    _saveEnabled: boolean;
    _menuEnabled: boolean;
    _encounterEnabled: boolean;
    _formationEnabled: boolean;
    _battleCount: number;
    _winCount: number;
    _escapeCount: number;
    _saveCount: number;
    _versionId: number;
    _savefileId: number;
    _framesOnSave: number;
    _bgmOnSave: any;
    _bgsOnSave: any;
    _windowTone: any;
    _battleBgm: any;
    _victoryMe: any;
    _defeatMe: any;
    _savedBgm: any;
    _walkingBgm: any;
    constructor(...args: any[]) {
        this.initialize(...args);
    }

    public initialize(...args) {
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

    public isJapanese() {
        return window.$dataSystem.locale.match(/^ja/);
    }

    public isChinese() {
        return window.$dataSystem.locale.match(/^zh/);
    }

    public isKorean() {
        return window.$dataSystem.locale.match(/^ko/);
    }

    public isCJK() {
        return window.$dataSystem.locale.match(/^(ja|zh|ko)/);
    }

    public isRussian() {
        return window.$dataSystem.locale.match(/^ru/);
    }

    public isSideView() {
        return window.$dataSystem.optSideView;
    }

    public isAutosaveEnabled() {
        return window.$dataSystem.optAutosave;
    }

    public isSaveEnabled() {
        return this._saveEnabled;
    }

    public disableSave() {
        this._saveEnabled = false;
    }

    public enableSave() {
        this._saveEnabled = true;
    }

    public isMenuEnabled() {
        return this._menuEnabled;
    }

    public disableMenu() {
        this._menuEnabled = false;
    }

    public enableMenu() {
        this._menuEnabled = true;
    }

    public isEncounterEnabled() {
        return this._encounterEnabled;
    }

    public disableEncounter() {
        this._encounterEnabled = false;
    }

    public enableEncounter() {
        this._encounterEnabled = true;
    }

    public isFormationEnabled() {
        return this._formationEnabled;
    }

    public disableFormation() {
        this._formationEnabled = false;
    }

    public enableFormation() {
        this._formationEnabled = true;
    }

    public battleCount() {
        return this._battleCount;
    }

    public winCount() {
        return this._winCount;
    }

    public escapeCount() {
        return this._escapeCount;
    }

    public saveCount() {
        return this._saveCount;
    }

    public versionId() {
        return this._versionId;
    }

    public savefileId() {
        return this._savefileId || 0;
    }

    public setSavefileId(savefileId) {
        this._savefileId = savefileId;
    }

    public windowTone() {
        return this._windowTone || window.$dataSystem.windowTone;
    }

    public setWindowTone(value) {
        this._windowTone = value;
    }

    public battleBgm() {
        return this._battleBgm || window.$dataSystem.battleBgm;
    }

    public setBattleBgm(value) {
        this._battleBgm = value;
    }

    public victoryMe() {
        return this._victoryMe || window.$dataSystem.victoryMe;
    }

    public setVictoryMe(value) {
        this._victoryMe = value;
    }

    public defeatMe() {
        return this._defeatMe || window.$dataSystem.defeatMe;
    }

    public setDefeatMe(value) {
        this._defeatMe = value;
    }

    public onBattleStart() {
        this._battleCount++;
    }

    public onBattleWin() {
        this._winCount++;
    }

    public onBattleEscape() {
        this._escapeCount++;
    }

    public onBeforeSave() {
        this._saveCount++;
        this._versionId = window.$dataSystem.versionId;
        this._framesOnSave = Graphics.frameCount;
        this._bgmOnSave = AudioManager.saveBgm();
        this._bgsOnSave = AudioManager.saveBgs();
    }

    public onAfterLoad() {
        Graphics.frameCount = this._framesOnSave;
        AudioManager.playBgm(this._bgmOnSave);
        AudioManager.playBgs(this._bgsOnSave);
    }

    public playtime() {
        return Math.floor(Graphics.frameCount / 60);
    }

    public playtimeText() {
        const hour = Math.floor(this.playtime() / 60 / 60);
        const min = Math.floor(this.playtime() / 60) % 60;
        const sec = this.playtime() % 60;
        return hour.padZero(2) + ":" + min.padZero(2) + ":" + sec.padZero(2);
    }

    public saveBgm() {
        this._savedBgm = AudioManager.saveBgm();
    }

    public replayBgm() {
        if (this._savedBgm) {
            AudioManager.replayBgm(this._savedBgm);
        }
    }

    public saveWalkingBgm() {
        this._walkingBgm = AudioManager.saveBgm();
    }

    public replayWalkingBgm() {
        if (this._walkingBgm) {
            AudioManager.playBgm(this._walkingBgm);
        }
    }

    public saveWalkingBgm2() {
        this._walkingBgm = window.$dataMap.bgm;
    }

    public mainFontFace() {
        return "rmmz-mainfont, " + window.$dataSystem.advanced.fallbackFonts;
    }

    public numberFontFace() {
        return "rmmz-numberfont, " + this.mainFontFace();
    }

    public mainFontSize() {
        return window.$dataSystem.advanced.fontSize;
    }

    public windowPadding() {
        return 12;
    }
    public windowOpacity() {
        if ("windowOpacity" in window.$dataSystem.advanced) {
            return window.$dataSystem.advanced.windowOpacity;
        } else {
            return 192;
        }
    };
}
