import { Point, Rectangle } from "./index.js";
export class TilingSprite extends PIXI.TilingSprite {
    static _emptyBaseTexture = null;
    _width;
    _bitmap;
    _height;
    _frame;
    origin;
    children = [];
    get bitmap() {
        return this._bitmap;
    }
    set bitmap(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    }
    get opacity() {
        return this.alpha * 255;
    }
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }
    constructor(...args) {
        super(new PIXI.Texture(new PIXI.BaseTexture()));
        this.initialize(...args);
    }
    initialize(bitmap) {
        if (!TilingSprite._emptyBaseTexture) {
            TilingSprite._emptyBaseTexture = new PIXI.BaseTexture();
            TilingSprite._emptyBaseTexture.setSize(1, 1);
        }
        const frame = new Rectangle();
        const texture = new PIXI.Texture(TilingSprite._emptyBaseTexture, frame);
        PIXI.TilingSprite.call(this, texture);
        this._bitmap = bitmap;
        this._width = 0;
        this._height = 0;
        this._frame = frame;
        this.origin = new Point();
        this._onBitmapChange();
    }
    destroy() {
        const options = { children: true, texture: true };
        PIXI.TilingSprite.prototype.destroy.call(this, options);
    }
    update() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }
    move(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
    }
    setFrame(x, y, width, height) {
        this._frame.x = x;
        this._frame.y = y;
        this._frame.width = width;
        this._frame.height = height;
        this._refresh();
    }
    updateTransform() {
        this.tilePosition.x = Math.round(-this.origin.x);
        this.tilePosition.y = Math.round(-this.origin.y);
        PIXI.TilingSprite.prototype.updateTransform.call(this);
    }
    _onBitmapChange() {
        if (this._bitmap) {
            this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
        }
        else {
            this.texture.frame = new Rectangle();
        }
    }
    _onBitmapLoad() {
        this.texture.baseTexture = this._bitmap.baseTexture;
        this._refresh();
    }
    _refresh() {
        const texture = this.texture;
        const frame = this._frame.clone();
        if (frame.width === 0 && frame.height === 0 && this._bitmap) {
            frame.width = this._bitmap.width;
            frame.height = this._bitmap.height;
        }
        if (texture) {
            if (texture.baseTexture) {
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
}
