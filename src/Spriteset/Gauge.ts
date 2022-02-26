import { Game_Actor } from "../Game/index.js";
import { Bitmap, Sprite } from "../Core/index.js";
import { ColorManager, TextManager } from "../Manager/index.js";

//-----------------------------------------------------------------------------
/**
 * Sprite_Gauge
 * 
 * The sprite for displaying a status gauge.
*/
export class Sprite_Gauge extends Sprite {
    _battler: Game_Actor;
    _statusType: string;
    _value: number;
    _maxValue: number;
    _targetValue: number;
    _targetMaxValue: number;
    _duration: number;
    _flashingCount: number;
    constructor(...args: any[]) {
        super();
        this.initialize(...args);
    }

    public initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.createBitmap();
    };

    public initMembers() {
        this._battler = null;
        this._statusType = "";
        this._value = NaN;
        this._maxValue = NaN;
        this._targetValue = NaN;
        this._targetMaxValue = NaN;
        this._duration = 0;
        this._flashingCount = 0;
    };

    public destroy(options) {
        this.bitmap.destroy();
        Sprite.prototype.destroy.call(this, options);
    };

    public createBitmap() {
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.bitmap = new Bitmap(width, height);
    };

    public bitmapWidth() {
        return 128;
    };

    public bitmapHeight() {
        return 32;
    };

    public textHeight() {
        return 24;
    };

    public gaugeHeight() {
        return 12;
    };

    public gaugeX() {
        if (this._statusType === "time") {
            return 0;
        } else {
            return this.measureLabelWidth() + 6;
        }
    };

    public labelY() {
        return 3;
    };

    public labelFontFace() {
        return window.$gameSystem.mainFontFace();
    };

    public labelFontSize() {
        return window.$gameSystem.mainFontSize() - 2;
    };

    public valueFontFace() {
        return window.$gameSystem.numberFontFace();
    };

    public valueFontSize() {
        return window.$gameSystem.mainFontSize() - 6;
    };

    public setup(battler, statusType) {
        this._battler = battler;
        this._statusType = statusType;
        this._value = this.currentValue();
        this._maxValue = this.currentMaxValue();
        this.updateBitmap();
    };

    public update() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
    };

    public updateBitmap() {
        const value = this.currentValue();
        const maxValue = this.currentMaxValue();
        if (value !== this._targetValue || maxValue !== this._targetMaxValue) {
            this.updateTargetValue(value, maxValue);
        }
        this.updateGaugeAnimation();
        this.updateFlashing();
    };

    public updateTargetValue(value, maxValue) {
        this._targetValue = value;
        this._targetMaxValue = maxValue;
        if (isNaN(this._value)) {
            this._value = value;
            this._maxValue = maxValue;
            this.redraw();
        } else {
            this._duration = this.smoothness();
        }
    };

    public smoothness() {
        return this._statusType === "time" ? 5 : 20;
    };

    public updateGaugeAnimation() {
        if (this._duration > 0) {
            const d = this._duration;
            this._value = (this._value * (d - 1) + this._targetValue) / d;
            this._maxValue = (this._maxValue * (d - 1) + this._targetMaxValue) / d;
            this._duration--;
            this.redraw();
        }
    };

    public updateFlashing() {
        if (this._statusType === "time") {
            this._flashingCount++;
            if (this._battler.isInputting()) {
                if (this._flashingCount % 30 < 15) {
                    this.setBlendColor(this.flashingColor1());
                } else {
                    this.setBlendColor(this.flashingColor2());
                }
            } else {
                this.setBlendColor([0, 0, 0, 0]);
            }
        }
    };

    public flashingColor1(): [number, number, number, number] {
        return [255, 255, 255, 64];
    };

    public flashingColor2(): [number, number, number, number] {
        return [0, 0, 255, 48];
    };

    public isValid() {
        if (this._battler) {
            if (this._statusType === "tp" && !this._battler.isPreserveTp()) {
                return window.$gameParty.inBattle();
            } else {
                return true;
            }
        }
        return false;
    };

    public currentValue() {
        if (this._battler) {
            switch (this._statusType) {
                case "hp":
                    return this._battler.hp;
                case "mp":
                    return this._battler.mp;
                case "tp":
                    return this._battler.tp;
                case "time":
                    return this._battler.tpbChargeTime();
            }
        }
        return NaN;
    };

    public currentMaxValue() {
        if (this._battler) {
            switch (this._statusType) {
                case "hp":
                    return this._battler.mhp;
                case "mp":
                    return this._battler.mmp;
                case "tp":
                    return this._battler.maxTp();
                case "time":
                    return 1;
            }
        }
        return NaN;
    };

    public label() {
        switch (this._statusType) {
            case "hp":
                return TextManager.hpA;
            case "mp":
                return TextManager.mpA;
            case "tp":
                return TextManager.tpA;
            default:
                return "";
        }
    };

    public gaugeBackColor() {
        return ColorManager.gaugeBackColor();
    };

    public gaugeColor1() {
        switch (this._statusType) {
            case "hp":
                return ColorManager.hpGaugeColor1();
            case "mp":
                return ColorManager.mpGaugeColor1();
            case "tp":
                return ColorManager.tpGaugeColor1();
            case "time":
                return ColorManager.ctGaugeColor1();
            default:
                return ColorManager.normalColor();
        }
    };

    public gaugeColor2() {
        switch (this._statusType) {
            case "hp":
                return ColorManager.hpGaugeColor2();
            case "mp":
                return ColorManager.mpGaugeColor2();
            case "tp":
                return ColorManager.tpGaugeColor2();
            case "time":
                return ColorManager.ctGaugeColor2();
            default:
                return ColorManager.normalColor();
        }
    };

    public labelColor() {
        return ColorManager.systemColor();
    };

    public labelOutlineColor() {
        return ColorManager.outlineColor();
    };

    public labelOutlineWidth() {
        return 3;
    };

    public valueColor() {
        switch (this._statusType) {
            case "hp":
                return ColorManager.hpColor(this._battler);
            case "mp":
                return ColorManager.mpColor(this._battler);
            case "tp":
                return ColorManager.tpColor(this._battler);
            default:
                return ColorManager.normalColor();
        }
    };

    public valueOutlineColor() {
        return "rgba(0, 0, 0, 1)";
    };

    public valueOutlineWidth() {
        return 2;
    };

    public redraw() {
        this.bitmap.clear();
        const currentValue = this.currentValue();
        if (!isNaN(currentValue)) {
            this.drawGauge();
            if (this._statusType !== "time") {
                this.drawLabel();
                if (this.isValid()) {
                    this.drawValue();
                }
            }
        }
    };

    public drawGauge() {
        const gaugeX = this.gaugeX();
        const gaugeY = this.textHeight() - this.gaugeHeight();
        const gaugewidth = this.bitmapWidth() - gaugeX;
        const gaugeHeight = this.gaugeHeight();
        this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
    };

    public drawGaugeRect(x, y, width, height) {
        const rate = this.gaugeRate();
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = this.gaugeBackColor();
        const color1 = this.gaugeColor1();
        const color2 = this.gaugeColor2();
        this.bitmap.fillRect(x, y, width, height, color0);
        this.bitmap.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
    };

    public gaugeRate() {
        if (this.isValid()) {
            const value = this._value;
            const maxValue = this._maxValue;
            return maxValue > 0 ? value / maxValue : 0;
        } else {
            return 0;
        }
    };

    public drawLabel() {
        const label = this.label();
        const x = this.labelOutlineWidth() / 2;
        const y = this.labelY();
        const width = this.bitmapWidth();
        const height = this.textHeight();
        this.setupLabelFont();
        this.bitmap.paintOpacity = this.labelOpacity();
        this.bitmap.drawText(label, x, y, width, height, "left");
        this.bitmap.paintOpacity = 255;
    };

    public setupLabelFont() {
        this.bitmap.fontFace = this.labelFontFace();
        this.bitmap.fontSize = this.labelFontSize();
        this.bitmap.textColor = this.labelColor();
        this.bitmap.outlineColor = this.labelOutlineColor();
        this.bitmap.outlineWidth = this.labelOutlineWidth();
    };

    public measureLabelWidth() {
        this.setupLabelFont();
        const labels = [TextManager.hpA, TextManager.mpA, TextManager.tpA];
        const widths = labels.map(str => this.bitmap.measureTextWidth(str));
        return Math.ceil(Math.max(...widths));
    };

    public labelOpacity() {
        return this.isValid() ? 255 : 160;
    };

    public drawValue() {
        const currentValue = this.currentValue();
        const width = this.bitmapWidth();
        const height = this.textHeight();
        this.setupValueFont();
        this.bitmap.drawText(currentValue, 0, 0, width, height, "right");
    };

    public setupValueFont() {
        this.bitmap.fontFace = this.valueFontFace();
        this.bitmap.fontSize = this.valueFontSize();
        this.bitmap.textColor = this.valueColor();
        this.bitmap.outlineColor = this.valueOutlineColor();
        this.bitmap.outlineWidth = this.valueOutlineWidth();
    };
}
