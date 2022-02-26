import { Graphics, Input, TouchInput } from "../Core/index.js";
import { ImageManager } from "../Manager/index.js";
import { Window_Base } from "./index.js";
export class Window_Message extends Window_Base {
    _background;
    _positionType;
    _waitCount;
    _faceBitmap;
    _textState;
    _goldWindow;
    _nameBoxWindow;
    _choiceListWindow;
    _numberInputWindow;
    _eventItemWindow;
    _showFast;
    _lineShowFast;
    _pauseSkip;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.initMembers();
    }
    ;
    initMembers() {
        this._background = 0;
        this._positionType = 2;
        this._waitCount = 0;
        this._faceBitmap = null;
        this._textState = null;
        this._goldWindow = null;
        this._nameBoxWindow = null;
        this._choiceListWindow = null;
        this._numberInputWindow = null;
        this._eventItemWindow = null;
        this.clearFlags();
    }
    ;
    setGoldWindow(goldWindow) {
        this._goldWindow = goldWindow;
    }
    ;
    setNameBoxWindow(nameBoxWindow) {
        this._nameBoxWindow = nameBoxWindow;
    }
    ;
    setChoiceListWindow(choiceListWindow) {
        this._choiceListWindow = choiceListWindow;
    }
    ;
    setNumberInputWindow(numberInputWindow) {
        this._numberInputWindow = numberInputWindow;
    }
    ;
    setEventItemWindow(eventItemWindow) {
        this._eventItemWindow = eventItemWindow;
    }
    ;
    clearFlags() {
        this._showFast = false;
        this._lineShowFast = false;
        this._pauseSkip = false;
    }
    ;
    update() {
        this.checkToNotClose();
        Window_Base.prototype.update.call(this);
        this.synchronizeNameBox();
        while (!this.isOpening() && !this.isClosing()) {
            if (this.updateWait()) {
                return;
            }
            else if (this.updateLoading()) {
                return;
            }
            else if (this.updateInput()) {
                return;
            }
            else if (this.updateMessage()) {
                return;
            }
            else if (this.canStart()) {
                this.startMessage();
            }
            else {
                this.startInput();
                return;
            }
        }
    }
    ;
    checkToNotClose() {
        if (this.isOpen() && this.isClosing() && this.doesContinue()) {
            this.open();
        }
    }
    ;
    synchronizeNameBox() {
        this._nameBoxWindow.openness = this.openness;
    }
    ;
    canStart() {
        return window.$gameMessage.hasText() && !window.$gameMessage.scrollMode();
    }
    ;
    startMessage() {
        const text = window.$gameMessage.allText();
        const textState = this.createTextState(text, 0, 0, 0);
        textState.x = this.newLineX(textState);
        textState.startX = textState.x;
        this._textState = textState;
        this.newPage(this._textState);
        this.updatePlacement();
        this.updateBackground();
        this.open();
        this._nameBoxWindow.start();
    }
    ;
    newLineX(textState) {
        const faceExists = window.$gameMessage.faceName() !== "";
        const faceWidth = ImageManager.faceWidth;
        const spacing = 20;
        const margin = faceExists ? faceWidth + spacing : 4;
        return textState.rtl ? this.innerWidth - margin : margin;
    }
    ;
    updatePlacement() {
        const goldWindow = this._goldWindow;
        this._positionType = window.$gameMessage.positionType();
        this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
        if (goldWindow) {
            goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
        }
    }
    ;
    updateBackground() {
        this._background = window.$gameMessage.background();
        this.setBackgroundType(this._background);
    }
    ;
    terminateMessage() {
        this.close();
        this._goldWindow.close();
        window.$gameMessage.clear();
    }
    ;
    updateWait() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        else {
            return false;
        }
    }
    ;
    updateLoading() {
        if (this._faceBitmap) {
            if (this._faceBitmap.isReady()) {
                this.drawMessageFace();
                this._faceBitmap = null;
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    ;
    updateInput() {
        if (this.isAnySubWindowActive()) {
            return true;
        }
        if (this.pause) {
            if (this.isTriggered()) {
                Input.update();
                this.pause = false;
                if (!this._textState) {
                    this.terminateMessage();
                }
            }
            return true;
        }
        return false;
    }
    ;
    isAnySubWindowActive() {
        return (this._choiceListWindow.active ||
            this._numberInputWindow.active ||
            this._eventItemWindow.active);
    }
    ;
    updateMessage() {
        const textState = this._textState;
        if (textState) {
            while (!this.isEndOfText(textState)) {
                if (this.needsNewPage(textState)) {
                    this.newPage(textState);
                }
                this.updateShowFast();
                this.processCharacter(textState);
                if (this.shouldBreakHere(textState)) {
                    break;
                }
            }
            this.flushTextState(textState);
            if (this.isEndOfText(textState) && !this.isWaiting()) {
                this.onEndOfText();
            }
            return true;
        }
        else {
            return false;
        }
    }
    ;
    shouldBreakHere(textState) {
        if (this.canBreakHere(textState)) {
            if (!this._showFast && !this._lineShowFast) {
                return true;
            }
            if (this.isWaiting()) {
                return true;
            }
        }
        return false;
    }
    ;
    canBreakHere(textState) {
        if (!this.isEndOfText(textState)) {
            const c = textState.text[textState.index];
            if (c.charCodeAt(0) >= 0xdc00 && c.charCodeAt(0) <= 0xdfff) {
                return false;
            }
            if (textState.rtl && c.charCodeAt(0) > 0x20) {
                return false;
            }
        }
        return true;
    }
    ;
    onEndOfText() {
        if (!this.startInput()) {
            if (!this._pauseSkip) {
                this.startPause();
            }
            else {
                this.terminateMessage();
            }
        }
        this._textState = null;
    }
    ;
    startInput() {
        if (window.$gameMessage.isChoice()) {
            this._choiceListWindow.start();
            return true;
        }
        else if (window.$gameMessage.isNumberInput()) {
            this._numberInputWindow.start();
            return true;
        }
        else if (window.$gameMessage.isItemChoice()) {
            this._eventItemWindow.start();
            return true;
        }
        else {
            return false;
        }
    }
    ;
    isTriggered() {
        return (Input.isRepeated("ok") ||
            Input.isRepeated("cancel") ||
            TouchInput.isRepeated());
    }
    ;
    doesContinue() {
        return (window.$gameMessage.hasText() &&
            !window.$gameMessage.scrollMode() &&
            !this.areSettingsChanged());
    }
    ;
    areSettingsChanged() {
        return (this._background !== window.$gameMessage.background() ||
            this._positionType !== window.$gameMessage.positionType());
    }
    ;
    updateShowFast() {
        if (this.isTriggered()) {
            this._showFast = true;
        }
    }
    ;
    newPage(textState) {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        this.updateSpeakerName();
        this.loadMessageFace();
        textState.x = textState.startX;
        textState.y = 0;
        textState.height = this.calcTextHeight(textState);
    }
    ;
    updateSpeakerName() {
        this._nameBoxWindow.setName(window.$gameMessage.speakerName());
    }
    ;
    loadMessageFace() {
        this._faceBitmap = ImageManager.loadFace(window.$gameMessage.faceName());
    }
    ;
    drawMessageFace() {
        const faceName = window.$gameMessage.faceName();
        const faceIndex = window.$gameMessage.faceIndex();
        const rtl = window.$gameMessage.isRTL();
        const width = ImageManager.faceWidth;
        const height = this.innerHeight;
        const x = rtl ? this.innerWidth - width - 4 : 4;
        this.drawFace(faceName, faceIndex, x, 0, width, height);
    }
    ;
    processControlCharacter(textState, c) {
        Window_Base.prototype.processControlCharacter.call(this, textState, c);
        if (c === "\f") {
            this.processNewPage(textState);
        }
    }
    ;
    processNewLine(textState) {
        this._lineShowFast = false;
        Window_Base.prototype.processNewLine.call(this, textState);
        if (this.needsNewPage(textState)) {
            this.startPause();
        }
    }
    ;
    processNewPage(textState) {
        if (textState.text[textState.index] === "\n") {
            textState.index++;
        }
        textState.y = this.contents.height;
        this.startPause();
    }
    ;
    isEndOfText(textState) {
        return textState.index >= textState.text.length;
    }
    ;
    needsNewPage(textState) {
        return (!this.isEndOfText(textState) &&
            textState.y + textState.height > this.contents.height);
    }
    ;
    processEscapeCharacter(code, textState) {
        switch (code) {
            case "$":
                this._goldWindow.open();
                break;
            case ".":
                this.startWait(15);
                break;
            case "|":
                this.startWait(60);
                break;
            case "!":
                this.startPause();
                break;
            case ">":
                this._lineShowFast = true;
                break;
            case "<":
                this._lineShowFast = false;
                break;
            case "^":
                this._pauseSkip = true;
                break;
            default:
                Window_Base.prototype.processEscapeCharacter.call(this, code, textState);
                break;
        }
    }
    ;
    startWait(count) {
        this._waitCount = count;
    }
    ;
    startPause() {
        this.startWait(10);
        this.pause = true;
    }
    ;
    isWaiting() {
        return this.pause || this._waitCount > 0;
    }
    ;
}
