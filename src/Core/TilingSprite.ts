import { Bitmap, Point, Rectangle } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * The sprite object for a tiling image.
 *
 * @class
 * @extends PIXI.TilingSprite
 * @param {Bitmap} bitmap - The image for the tiling sprite.
 */
export class TilingSprite extends PIXI.TilingSprite {
    static _emptyBaseTexture: Nullable<PIXI.BaseTexture> = null;
    _width: number;
    _bitmap: Bitmap;
    _height: number;
    _frame: Rectangle;
    origin: Point;
    children: TilingSprite[]=[];
    /**
     * The image for the tiling sprite.
     *
     * @type Bitmap
     * @name TilingSprite#bitmap
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
    * The opacity of the tiling sprite (0 to 255).
    *
    * @type number
    * @name TilingSprite#opacity
    */
    get opacity() {
        return this.alpha * 255;
    }
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }

    constructor(...args: [Bitmap?]) {
        super(new PIXI.Texture(new PIXI.BaseTexture()));
        this.initialize(...args);
    }

    public initialize(bitmap?: Bitmap) {
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

        /**
         * The origin point of the tiling sprite for scrolling.
         *
         * @type Point
         */
        this.origin = new Point();

        this._onBitmapChange();
    }




    /**
     * Destroys the tiling sprite.
     */
    public destroy() {
        const options = { children: true, texture: true }
        PIXI.TilingSprite.prototype.destroy.call(this, options);
    }

    /**
     * Updates the tiling sprite for each frame.
     */
    public update() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @param {number} x - The x coordinate of the tiling sprite.
     * @param {number} y - The y coordinate of the tiling sprite.
     * @param {number} width - The width of the tiling sprite.
     * @param {number} height - The height of the tiling sprite.
     */
    public move(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
    }

    /**
     * Specifies the region of the image that the tiling sprite will use.
     *
     * @param {number} x - The x coordinate of the frame.
     * @param {number} y - The y coordinate of the frame.
     * @param {number} width - The width of the frame.
     * @param {number} height - The height of the frame.
     */
    public setFrame(x, y, width, height) {
        this._frame.x = x;
        this._frame.y = y;
        this._frame.width = width;
        this._frame.height = height;
        this._refresh();
    }

    /**
     * Updates the transform on all children of this container for rendering.
     */
    public updateTransform() {
        this.tilePosition.x = Math.round(-this.origin.x);
        this.tilePosition.y = Math.round(-this.origin.y);
        PIXI.TilingSprite.prototype.updateTransform.call(this);
    }

    public _onBitmapChange() {
        if (this._bitmap) {
            this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
        } else {
            this.texture.frame = new Rectangle();
        }
    }

    public _onBitmapLoad() {
        this.texture.baseTexture = this._bitmap.baseTexture;
        this._refresh();
    }

    public _refresh() {
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
                } catch (e) {
                    texture.frame = new Rectangle();
                }
            }
            //@ts-ignore
            texture._updateID++;
        }
    }

}

// TilingSprite.prototype = Object.create(PIXI.TilingSprite.prototype);
// public constructor = TilingSprite;
