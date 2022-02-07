import { Rectangle, ColorFilter } from "./index.js";
export class Sprite extends PIXI.Sprite {
    spriteId;
    _bitmap;
    _frame;
    _hue;
    _blendColor;
    _colorTone;
    _colorFilter;
    _blendMode;
    _hidden;
    _refreshFrame;
    static _emptyBaseTexture;
    static _counter;
    children = [];
    ax;
    ay;
    get bitmap() {
        return this._bitmap;
    }
    set bitmap(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    }
    get width() {
        return this._frame.width;
    }
    set width(value) {
        this._frame.width = value;
        this._refresh();
    }
    get height() {
        return this._frame.height;
    }
    set height(value) {
        this._frame.height = value;
        this._refresh();
    }
    get opacity() {
        return this.alpha * 255;
    }
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }
    get blendMode() {
        if (this._colorFilter) {
            return this._colorFilter.blendMode;
        }
        else {
            return this._blendMode;
        }
    }
    set blendMode(value) {
        this._blendMode = value;
        if (this._colorFilter) {
            this._colorFilter.blendMode = value;
        }
    }
    constructor(bitmap) {
        super();
        delete this.width;
        delete this.height;
        delete this.blendMode;
        this.initialize(bitmap);
    }
    initialize(bitmap) {
        if (!Sprite._emptyBaseTexture) {
            Sprite._emptyBaseTexture = new PIXI.BaseTexture();
            Sprite._emptyBaseTexture.setSize(1, 1);
        }
        const frame = new Rectangle();
        const texture = new PIXI.Texture(Sprite._emptyBaseTexture, frame);
        PIXI.Sprite.call(this, texture);
        this.spriteId = Sprite._counter++;
        this._bitmap = bitmap;
        this._frame = frame;
        this._hue = 0;
        this._blendColor = [0, 0, 0, 0];
        this._colorTone = [0, 0, 0, 0];
        this._colorFilter = null;
        this._blendMode = PIXI.BLEND_MODES.NORMAL;
        this._hidden = false;
        this._onBitmapChange();
    }
    ;
    destroy(...args) {
        const options = { children: true, texture: true };
        PIXI.Sprite.prototype.destroy.call(this, options);
    }
    ;
    update() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }
    ;
    hide() {
        this._hidden = true;
        this.updateVisibility();
    }
    ;
    show() {
        this._hidden = false;
        this.updateVisibility();
    }
    ;
    updateVisibility() {
        this.visible = !this._hidden;
    }
    ;
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    ;
    setFrame(x, y, width, height) {
        this._refreshFrame = false;
        const frame = this._frame;
        if (x !== frame.x ||
            y !== frame.y ||
            width !== frame.width ||
            height !== frame.height) {
            frame.x = x;
            frame.y = y;
            frame.width = width;
            frame.height = height;
            this._refresh();
        }
    }
    ;
    setHue(hue) {
        if (this._hue !== Number(hue)) {
            this._hue = Number(hue);
            this._updateColorFilter();
        }
    }
    ;
    getBlendColor() {
        return this._blendColor.clone();
    }
    ;
    setBlendColor(color) {
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._blendColor.equals(color)) {
            this._blendColor = color.clone();
            this._updateColorFilter();
        }
    }
    ;
    getColorTone() {
        return this._colorTone.clone();
    }
    ;
    setColorTone(tone) {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._colorTone.equals(tone)) {
            this._colorTone = tone.clone();
            this._updateColorFilter();
        }
    }
    ;
    _onBitmapChange() {
        if (this._bitmap) {
            this._refreshFrame = true;
            this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
        }
        else {
            this._refreshFrame = false;
            this.texture.frame = new Rectangle();
        }
    }
    ;
    _onBitmapLoad(bitmapLoaded) {
        if (bitmapLoaded === this._bitmap) {
            if (this._refreshFrame && this._bitmap) {
                this._refreshFrame = false;
                this._frame.width = this._bitmap.width;
                this._frame.height = this._bitmap.height;
            }
        }
        this._refresh();
    }
    ;
    _refresh() {
        const texture = this.texture;
        const frameX = Math.floor(this._frame.x);
        const frameY = Math.floor(this._frame.y);
        const frameW = Math.floor(this._frame.width);
        const frameH = Math.floor(this._frame.height);
        const baseTexture = this._bitmap ? this._bitmap.baseTexture : null;
        const baseTextureW = baseTexture ? baseTexture.width : 0;
        const baseTextureH = baseTexture ? baseTexture.height : 0;
        const realX = frameX.clamp(0, baseTextureW);
        const realY = frameY.clamp(0, baseTextureH);
        const realW = (frameW - realX + frameX).clamp(0, baseTextureW - realX);
        const realH = (frameH - realY + frameY).clamp(0, baseTextureH - realY);
        const frame = new Rectangle(realX, realY, realW, realH);
        if (texture) {
            this.pivot.x = frameX - realX;
            this.pivot.y = frameY - realY;
            if (baseTexture) {
                texture.baseTexture = baseTexture;
                try {
                    texture.frame = frame;
                }
                catch (e) {
                    texture.frame = new Rectangle();
                }
            }
            texture._updateID++;
        }
    }
    ;
    _createColorFilter() {
        this._colorFilter = new ColorFilter();
        if (!this.filters) {
            this.filters = [];
        }
        this.filters.push(this._colorFilter);
    }
    ;
    _updateColorFilter() {
        if (!this._colorFilter) {
            this._createColorFilter();
        }
        this._colorFilter.setHue(this._hue);
        this._colorFilter.setBlendColor(this._blendColor);
        this._colorFilter.setColorTone(this._colorTone);
    }
    ;
}
