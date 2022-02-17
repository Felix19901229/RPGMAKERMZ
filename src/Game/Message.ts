import { Utils } from "../Core/index.js";
//-----------------------------------------------------------------------------
/**
 * Game_Message
 * 
 * The game object class for the state of the message window that displays text
 * or selections, etc.
*/
export class Game_Message {
    _texts: string[];
    _choices: null[];
    _speakerName: string;
    _faceName: string;
    _faceIndex: number;
    _background: number;
    _positionType: number;
    _choiceDefaultType: number;
    _choiceCancelType: number;
    _choiceBackground: number;
    _choicePositionType: number;
    _numInputVariableId: number;
    _numInputMaxDigits: number;
    _itemChoiceVariableId: number;
    _itemChoiceItypeId: number;
    _scrollMode: boolean;
    _scrollSpeed: number;
    _scrollNoFast: boolean;
    _choiceCallback: Function;
    constructor(...args: any[]) {
        this.initialize(...args);

    }

    public initialize(...args) {
        this.clear();
    }

    public clear() {
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

    public choices() {
        return this._choices;
    }

    public speakerName() {
        return this._speakerName;
    }

    public faceName() {
        return this._faceName;
    }

    public faceIndex() {
        return this._faceIndex;
    }

    public background() {
        return this._background;
    }

    public positionType() {
        return this._positionType;
    }

    public choiceDefaultType() {
        return this._choiceDefaultType;
    }

    public choiceCancelType() {
        return this._choiceCancelType;
    }

    public choiceBackground() {
        return this._choiceBackground;
    }

    public choicePositionType() {
        return this._choicePositionType;
    }

    public numInputVariableId() {
        return this._numInputVariableId;
    }

    public numInputMaxDigits() {
        return this._numInputMaxDigits;
    }

    public itemChoiceVariableId() {
        return this._itemChoiceVariableId;
    }

    public itemChoiceItypeId() {
        return this._itemChoiceItypeId;
    }

    public scrollMode() {
        return this._scrollMode;
    }

    public scrollSpeed() {
        return this._scrollSpeed;
    }

    public scrollNoFast() {
        return this._scrollNoFast;
    }

    public add(text) {
        this._texts.push(text);
    }

    public setSpeakerName(speakerName) {
        this._speakerName = speakerName ? speakerName : "";
    }

    public setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    }

    public setBackground(background) {
        this._background = background;
    }

    public setPositionType(positionType) {
        this._positionType = positionType;
    }

    public setChoices(choices, defaultType, cancelType) {
        this._choices = choices;
        this._choiceDefaultType = defaultType;
        this._choiceCancelType = cancelType;
    }

    public setChoiceBackground(background) {
        this._choiceBackground = background;
    }

    public setChoicePositionType(positionType) {
        this._choicePositionType = positionType;
    }

    public setNumberInput(variableId, maxDigits) {
        this._numInputVariableId = variableId;
        this._numInputMaxDigits = maxDigits;
    }

    public setItemChoice(variableId, itemType) {
        this._itemChoiceVariableId = variableId;
        this._itemChoiceItypeId = itemType;
    }

    public setScroll(speed, noFast) {
        this._scrollMode = true;
        this._scrollSpeed = speed;
        this._scrollNoFast = noFast;
    }

    public setChoiceCallback(callback:Function) {
        this._choiceCallback = callback;
    }

    public onChoice(n) {
        if (this._choiceCallback) {
            this._choiceCallback(n);
            this._choiceCallback = null;
        }
    }

    public hasText() {
        return this._texts.length > 0;
    }

    public isChoice() {
        return this._choices.length > 0;
    }

    public isNumberInput() {
        return this._numInputVariableId > 0;
    }

    public isItemChoice() {
        return this._itemChoiceVariableId > 0;
    }

    public isBusy() {
        return (
            this.hasText() ||
            this.isChoice() ||
            this.isNumberInput() ||
            this.isItemChoice()
        );
    }

    public newPage() {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += "\f";
        }
    }

    public allText() {
        return this._texts.join("\n");
    }

    public isRTL() {
        return Utils.containsArabic(this.allText());
    }
}
