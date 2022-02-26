import { Utils } from "../Core/index.js";
export class Game_Message {
    _texts;
    _choices;
    _speakerName;
    _faceName;
    _faceIndex;
    _background;
    _positionType;
    _choiceDefaultType;
    _choiceCancelType;
    _choiceBackground;
    _choicePositionType;
    _numInputVariableId;
    _numInputMaxDigits;
    _itemChoiceVariableId;
    _itemChoiceItypeId;
    _scrollMode;
    _scrollSpeed;
    _scrollNoFast;
    _choiceCallback;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(...args) {
        this.clear();
    }
    clear() {
        this._texts = [];
        this._choices = [];
        this._speakerName = "";
        this._faceName = "";
        this._faceIndex = 0;
        this._background = 0;
        this._positionType = 2;
        this._choiceDefaultType = 0;
        this._choiceCancelType = 0;
        this._choiceBackground = 0;
        this._choicePositionType = 2;
        this._numInputVariableId = 0;
        this._numInputMaxDigits = 0;
        this._itemChoiceVariableId = 0;
        this._itemChoiceItypeId = 0;
        this._scrollMode = false;
        this._scrollSpeed = 2;
        this._scrollNoFast = false;
        this._choiceCallback = null;
    }
    choices() {
        return this._choices;
    }
    speakerName() {
        return this._speakerName;
    }
    faceName() {
        return this._faceName;
    }
    faceIndex() {
        return this._faceIndex;
    }
    background() {
        return this._background;
    }
    positionType() {
        return this._positionType;
    }
    choiceDefaultType() {
        return this._choiceDefaultType;
    }
    choiceCancelType() {
        return this._choiceCancelType;
    }
    choiceBackground() {
        return this._choiceBackground;
    }
    choicePositionType() {
        return this._choicePositionType;
    }
    numInputVariableId() {
        return this._numInputVariableId;
    }
    numInputMaxDigits() {
        return this._numInputMaxDigits;
    }
    itemChoiceVariableId() {
        return this._itemChoiceVariableId;
    }
    itemChoiceItypeId() {
        return this._itemChoiceItypeId;
    }
    scrollMode() {
        return this._scrollMode;
    }
    scrollSpeed() {
        return this._scrollSpeed;
    }
    scrollNoFast() {
        return this._scrollNoFast;
    }
    add(text) {
        this._texts.push(text);
    }
    setSpeakerName(speakerName) {
        this._speakerName = speakerName ? speakerName : "";
    }
    setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    }
    setBackground(background) {
        this._background = background;
    }
    setPositionType(positionType) {
        this._positionType = positionType;
    }
    setChoices(choices, defaultType, cancelType) {
        this._choices = choices;
        this._choiceDefaultType = defaultType;
        this._choiceCancelType = cancelType;
    }
    setChoiceBackground(background) {
        this._choiceBackground = background;
    }
    setChoicePositionType(positionType) {
        this._choicePositionType = positionType;
    }
    setNumberInput(variableId, maxDigits) {
        this._numInputVariableId = variableId;
        this._numInputMaxDigits = maxDigits;
    }
    setItemChoice(variableId, itemType) {
        this._itemChoiceVariableId = variableId;
        this._itemChoiceItypeId = itemType;
    }
    setScroll(speed, noFast) {
        this._scrollMode = true;
        this._scrollSpeed = speed;
        this._scrollNoFast = noFast;
    }
    setChoiceCallback(callback) {
        this._choiceCallback = callback;
    }
    onChoice(n) {
        if (this._choiceCallback) {
            this._choiceCallback(n);
            this._choiceCallback = null;
        }
    }
    hasText() {
        return this._texts.length > 0;
    }
    isChoice() {
        return this._choices.length > 0;
    }
    isNumberInput() {
        return this._numInputVariableId > 0;
    }
    isItemChoice() {
        return this._itemChoiceVariableId > 0;
    }
    isBusy() {
        return (this.hasText() ||
            this.isChoice() ||
            this.isNumberInput() ||
            this.isItemChoice());
    }
    newPage() {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += "\f";
        }
    }
    allText() {
        return this._texts.join("\n");
    }
    isRTL() {
        return Utils.containsArabic(this.allText());
    }
}
