import { Bitmap, ColorFilter, Rectangle } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * The basic object that is rendered to the game screen.
 *
 * @class
 * @extends PIXI.Sprite
 * @param {Bitmap} bitmap - The image for the sprite.
 */
export class Sprite extends PIXI.Sprite {
    static _emptyBaseTexture = null;
    static _counter = 0;
    _frame: Rectangle;
    _hue: number;
    _blendColor: [number, number, number, number];
    _colorTone: [number, number, number, number];
    _blendMode: PIXI.BLEND_MODES;
    _hidden: boolean;
    spriteId: number;
    _colorFilter: any;
    _bitmap: Bitmap;
    children:Sprite[]=[];
    _refreshFrame: boolean;
    ax:number;
    ay:number;
    dy: number;
    ry: number;
    z:number;
    /**
     * The image for the sprite.
     *
     * @type Bitmap
     * @name Sprite#bitmap
     */
    get bitmap() {
        return this._bitmap;
    }
    set bitmap(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    }

    /**
     * The width of the sprite without the scale.
     *
     * @type number
     * @name Sprite#width
     */
    //@ts-ignore
    get width() {
        return this._frame.width;
    }
    set width(value) {
        this._frame.width = value;
        this._refresh();
    }

    /**
     * The height of the sprite without the scale.
     *
     * @type number
     * @name Sprite#height
     */
    //@ts-ignore
    get height() {
        return this._frame.height;
    }
    set height(value) {
        this._frame.height = value;
        this._refresh();
    }

    /**
     * The opacity of the sprite (0 to 255).
     *
     * @type number
     * @name Sprite#opacity
     */
    get opacity() {
        return this.alpha * 255;
    }
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The blend mode to be applied to the sprite.
     *
     * @type number
     * @name Sprite#blendMode
     */
    //@ts-ignore
    get blendMode() {
        if (this._colorFilter) {
            return this._colorFilter.blendMode;
        } else {
            return this._blendMode;
        }
    }
    set blendMode(value) {
        this._blendMode = value;
        if (this._colorFilter) {
            this._colorFilter.blendMode = value;
        }
    }
    constructor(...args: [Bitmap?]) {
        super();
        delete this.width;
        delete this.height;
        delete this.blendMode;
        this.initialize(...args);
    }

    public initialize(bitmap?:Bitmap) {
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




    /**
     * Destroys the sprite.
     */
    public destroy(...args:any[]) {
        const options = { children: true, texture: true }
        PIXI.Sprite.prototype.destroy.call(this, options);
    }

    /**
     * Updates the sprite for each frame.
     */
    public update() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Makes the sprite "hidden".
     */
    public hide() {
        this._hidden = true;
        this.updateVisibility();
    }

    /**
     * Releases the "hidden" state of the sprite.
     */
    public show() {
        this._hidden = false;
        this.updateVisibility();
    }

    /**
     * Reflects the "hidden" state of the sprite to the visible state.
     */
    public updateVisibility() {
        this.visible = !this._hidden;
    }

    /**
     * Sets the x and y at once.
     *
     * @param {number} x - The x coordinate of the sprite.
     * @param {number} y - The y coordinate of the sprite.
     */
    public move(x, y,...args:number[]) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the rectagle of the bitmap that the sprite displays.
     *
     * @param {number} x - The x coordinate of the frame.
     * @param {number} y - The y coordinate of the frame.
     * @param {number} width - The width of the frame.
     * @param {number} height - The height of the frame.
     */
    public setFrame(x, y, width, height) {
        this._refreshFrame = false;
        const frame = this._frame;
        if (
            x !== frame.x ||
            y !== frame.y ||
            width !== frame.width ||
            height !== frame.height
        ) {
            frame.x = x;
            frame.y = y;
            frame.width = width;
            frame.height = height;
            this._refresh();
        }
    }

    /**
     * Sets the hue rotation value.
     *
     * @param {number} hue - The hue value (-360, 360).
     */
    public setHue(hue) {
        if (this._hue !== Number(hue)) {
            this._hue = Number(hue);
            this._updateColorFilter();
        }
    }

    /**
     * Gets the blend color for the sprite.
     *
     * @returns {array} The blend color [r, g, b, a].
     */
    public getBlendColor() {
        return this._blendColor.clone();
    }

    /**
     * Sets the blend color for the sprite.
     *
     * @param {array} color - The blend color [r, g, b, a].
     */
    public setBlendColor(color:[number,number,number,number]) {
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._blendColor.equals(color)) {
            this._blendColor = color.clone();
            this._updateColorFilter();
        }
    }

    /**
     * Gets the color tone for the sprite.
     *
     * @returns {array} The color tone [r, g, b, gray].
     */
    public getColorTone() {
        return this._colorTone.clone();
    }

    /**
     * Sets the color tone for the sprite.
     *
     * @param {array} tone - The color tone [r, g, b, gray].
     */
    public setColorTone(tone:[number,number,number,number]) {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._colorTone.equals(tone)) {
            this._colorTone = tone.clone();
            this._updateColorFilter();
        }
    }

    public _onBitmapChange() {
        if (this._bitmap) {
            this._refreshFrame = true;
            this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
        } else {
            this._refreshFrame = false;
            this.texture.frame = new Rectangle();
        }
    }

    public _onBitmapLoad(bitmapLoaded) {
        if (bitmapLoaded === this._bitmap) {
            if (this._refreshFrame && this._bitmap) {
                this._refreshFrame = false;
                this._frame.width = this._bitmap.width;
                this._frame.height = this._bitmap.height;
            }
        }
        this._refresh();
    }

    public _refresh() {
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
                } catch (e) {
                    texture.frame = new Rectangle();
                }
            }
            (texture as any)._updateID++;
        }
    }

    public _createColorFilter() {
        this._colorFilter = new ColorFilter();
        if (!this.filters) {
            this.filters = [];
        }
        this.filters.push(this._colorFilter);
    }

    public _updateColorFilter() {
        if (!this._colorFilter) {
            this._createColorFilter();
        }
        this._colorFilter.setHue(this._hue);
        this._colorFilter.setBlendColor(this._blendColor);
        this._colorFilter.setColorTone(this._colorTone);
    }
}
