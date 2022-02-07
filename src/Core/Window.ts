import { Bitmap, Point, Rectangle, Sprite, TilingSprite } from "./index.js";
type _container = {
    [K in keyof Omit<Sprite, keyof PIXI.Container>]?: Sprite[K];
} & PIXI.Container
//-----------------------------------------------------------------------------
/**
 * The window in the game.
 *
 * @class
 * @extends PIXI.Container
 */
export class Window extends PIXI.Container {
    public _isWindow: boolean;
    public _windowskin: Bitmap;
    public _width: number;
    public _height: number;
    public _cursorRect: Rectangle;
    public _openness: number;
    public _animationCount: number;
    public _padding: number;
    public _margin: number;
    public _colorTone: [number, number, number, number];
    public _innerChildren: Sprite[];
    public _container: _container;
    public _frameSprite: Sprite;
    public _backSprite: Sprite;
    public _contentsBackSprite: Sprite;
    public _cursorSprite: Sprite;
    public _contentsSprite: Sprite;
    public _downArrowSprite: Sprite;
    public _upArrowSprite: Sprite;
    public _pauseSignSprite: Sprite;
    public children: Array<_container> = [];
    /**
     * The origin point of the window for scrolling.
     *
     * @type Point
     */
    public origin: Point;
    /**
     * The active state for the window.
     *
     * @type boolean
     */
    public active: boolean;

    /**
     * The visibility of the frame.
     *
     * @type boolean
     */
    public frameVisible: boolean;

    /**
     * The visibility of the cursor.
     *
     * @type boolean
     */
    public cursorVisible: boolean;

    /**
     * The visibility of the down scroll arrow.
     *
     * @type boolean
     */
    public downArrowVisible: boolean;

    /**
     * The visibility of the up scroll arrow.
     *
     * @type boolean
     */
    public upArrowVisible: boolean;

    /**
     * The visibility of the pause sign.
     *
     * @type boolean
     */
    public pause: boolean;
    private _clientArea: Sprite;
    /**
     * The image used as a window skin.
     *
     * @type Bitmap
     * @name Window#windowskin
     */
    public get windowskin() {
        return this._windowskin;
    }
    public set windowskin(value) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    }

    /**
     * The bitmap used for the window contents.
     *
     * @type Bitmap
     * @name Window#contents
     */
    public get contents() {
        return this._contentsSprite.bitmap;
    }
    public set contents(value) {
        this._contentsSprite.bitmap = value;
    }


    /**
     * The bitmap used for the window contents background.
     *
     * @type Bitmap
     * @name Window#contentsBack
     */
    public get contentsBack() {
        return this._contentsBackSprite.bitmap;
    }
    public set contentsBack(value) {
        this._contentsBackSprite.bitmap = value;
    }

    /**
     * The width of the window in pixels.
     *
     * @type number
     * @name Window#width
     */
    //@ts-ignore
    public get width() {
        return this._width;
    }
    public set width(value) {
        this._width = value;
        this._refreshAllParts();
    }

    /**
     * The height of the window in pixels.
     *
     * @type number
     * @name Window#height
     */
    //@ts-ignore
    public get height() {
        return this._height;
    }
    public set height(value) {
        this._height = value;
        this._refreshAllParts();
    }

    /**
     * The size of the padding between the frame and contents.
     *
     * @type number
     * @name Window#padding
     */
    public get padding() {
        return this._padding;
    }
    public set padding(value) {
        this._padding = value;
        this._refreshAllParts();
    }

    /**
     * The size of the margin for the window background.
     *
     * @type number
     * @name Window#margin
     */
    get margin() {
        return this._margin;
    }
    set margin(value) {
        this._margin = value;
        this._refreshAllParts();
    }

    /**
     * The opacity of the window without contents (0 to 255).
     *
     * @type number
     * @name Window#opacity
     */
    public get opacity() {
        return this._container.alpha * 255;
    }
    public set opacity(value) {
        this._container.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The opacity of the window background (0 to 255).
     *
     * @type number
     * @name Window#backOpacity
     */
    public get backOpacity() {
        return this._backSprite.alpha * 255;
    }
    public set backOpacity(value) {
        this._backSprite.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The opacity of the window contents (0 to 255).
     *
     * @type number
     * @name Window#contentsOpacity
     */
    public get contentsOpacity() {
        return this._contentsSprite.alpha * 255;
    }
    public set contentsOpacity(value) {
        this._contentsSprite.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The openness of the window (0 to 255).
     *
     * @type number
     * @name Window#openness
     */
    public get openness() {
        return this._openness;
    }
    public set openness(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
            this._container.scale.y = this._openness / 255;
            this._container.y = (this.height / 2) * (1 - this._openness / 255);
        }
    }

    /**
     * The width of the content area in pixels.
     *
     * @readonly
     * @type number
     * @name Window#innerWidth
     */
    public get innerWidth() {
        return Math.max(0, this._width - this._padding * 2);
    }

    /**
     * The height of the content area in pixels.
     *
     * @readonly
     * @type number
     * @name Window#innerHeight
     */
    public get innerHeight() {
        return Math.max(0, this._height - this._padding * 2);
    }

    /**
     * The rectangle of the content area.
     *
     * @readonly
     * @type Rectangle
     * @name Window#innerRect
     */
    public get innerRect() {
        return new Rectangle(
            this._padding,
            this._padding,
            this.innerWidth,
            this.innerHeight
        );
    }
    constructor() {
        super();
        delete this.width;
        delete this.height;
        this.initialize();
    }
    public initialize(...ars) {
        PIXI.Container.call(this);
        this._isWindow = true;
        this._windowskin = null;
        this._width = 0;
        this._height = 0;
        this._cursorRect = new Rectangle();
        this._openness = 255;
        this._animationCount = 0;

        this._padding = 12;
        this._margin = 4;
        this._colorTone = [0, 0, 0, 0];
        this._innerChildren = [];

        this._container = null;
        this._backSprite = null;
        this._frameSprite = null;
        this._contentsBackSprite = null;
        this._cursorSprite = null;
        this._contentsSprite = null;
        this._downArrowSprite = null;
        this._upArrowSprite = null;
        this._pauseSignSprite = null;

        this._createAllParts();
        this.origin = new Point();

        /**
         * The active state for the window.
         *
         * @type boolean
         */
        this.active = true;

        /**
         * The visibility of the frame.
         *
         * @type boolean
         */
        this.frameVisible = true;

        /**
         * The visibility of the cursor.
         *
         * @type boolean
         */
        this.cursorVisible = true;

        /**
         * The visibility of the down scroll arrow.
         *
         * @type boolean
         */
        this.downArrowVisible = false;

        /**
         * The visibility of the up scroll arrow.
         *
         * @type boolean
         */
        this.upArrowVisible = false;

        /**
         * The visibility of the pause sign.
         *
         * @type boolean
         */
        this.pause = false;
    }
    /**
     * Destroys the window.
     */
    public destroy(...args) {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
    };

    /**
     * Updates the window for each frame.
     */
    public update() {
        if (this.active) {
            this._animationCount++;
        }
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    };

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @param {number} x - The x coordinate of the window.
     * @param {number} y - The y coordinate of the window.
     * @param {number} width - The width of the window.
     * @param {number} height - The height of the window.
     */
    public move(x: number = 0, y: number = 0, width: number, height: number) {
        this.x = x;
        this.y = y;
        if (this._width !== width || this._height !== height) {
            this._width = width;
            this._height = height;
            this._refreshAllParts();
        }
    };

    /**
     * Checks whether the window is completely open (openness == 255).
     *
     * @returns {boolean} True if the window is open.
     */
    public isOpen() {
        return this._openness >= 255;
    };

    /**
     * Checks whether the window is completely closed (openness == 0).
     *
     * @returns {boolean} True if the window is closed.
     */
    public isClosed() {
        return this._openness <= 0;
    };

    /**
     * Sets the position of the command cursor.
     *
     * @param {number} x - The x coordinate of the cursor.
     * @param {number} y - The y coordinate of the cursor.
     * @param {number} width - The width of the cursor.
     * @param {number} height - The height of the cursor.
     */
    public setCursorRect(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        const cw = Math.floor(width);
        const ch = Math.floor(height);
        this._cursorRect.x = Math.floor(x);
        this._cursorRect.y = Math.floor(y);
        if (this._cursorRect.width !== cw || this._cursorRect.height !== ch) {
            this._cursorRect.width = cw;
            this._cursorRect.height = ch;
            this._refreshCursor();
        }
    };

    /**
     * Moves the cursor position by the given amount.
     *
     * @param {number} x - The amount of horizontal movement.
     * @param {number} y - The amount of vertical movement.
     */
    public moveCursorBy(x: number, y: number) {
        this._cursorRect.x += x;
        this._cursorRect.y += y;
    };

    /**
     * Moves the inner children by the given amount.
     *
     * @param {number} x - The amount of horizontal movement.
     * @param {number} y - The amount of vertical movement.
     */
    public moveInnerChildrenBy(x: number, y: number) {
        for (const child of this._innerChildren) {
            child.x += x;
            child.y += y;
        }
    };

    /**
     * Changes the color of the background.
     *
     * @param {number} r - The red value in the range (-255, 255).
     * @param {number} g - The green value in the range (-255, 255).
     * @param {number} b - The blue value in the range (-255, 255).
     */
    public setTone(r: number, g: number, b: number) {
        const tone = this._colorTone;
        if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
            this._colorTone = [r, g, b, 0];
            this._refreshBack();
        }
    };

    /**
     * Adds a child between the background and contents.
     *
     * @param {object} child - The child to add.
     * @returns {object} The child that was added.
     */
    public addChildToBack(child: _container) {
        const containerIndex = this.children.indexOf(this._container);
        return this.addChildAt(child, containerIndex + 1);
    };

    /**
     * Adds a child to the client area.
     *
     * @param {object} child - The child to add.
     * @returns {object} The child that was added.
     */
    public addInnerChild(child: Sprite) {
        this._innerChildren.push(child);
        return this._clientArea.addChild(child);
    };

    /**
     * Updates the transform on all children of this container for rendering.
     */
    public updateTransform() {
        this._updateClientArea();
        this._updateFrame();
        this._updateContentsBack();
        this._updateCursor();
        this._updateContents();
        this._updateArrows();
        this._updatePauseSign();
        PIXI.Container.prototype.updateTransform.call(this);
        this._updateFilterArea();
    };

    /**
     * Draws the window shape into PIXI.Graphics object. Used by WindowLayer.
     */
    public drawShape(graphics: PIXI.Graphics) {
        if (graphics) {
            const width = this.width;
            const height = (this.height * this._openness) / 255;
            const x = this.x;
            const y = this.y + (this.height - height) / 2;
            graphics.beginFill(0xffffff);
            graphics.drawRoundedRect(x, y, width, height, 0);
            graphics.endFill();
        }
    };

    public _createAllParts() {
        this._createContainer();
        this._createBackSprite();
        this._createFrameSprite();
        this._createClientArea();
        this._createContentsBackSprite();
        this._createCursorSprite();
        this._createContentsSprite();
        this._createArrowSprites();
        this._createPauseSignSprites();
    };

    public _createContainer() {
        this._container = new PIXI.Container();
        this.addChild(this._container);
    };

    public _createBackSprite() {
        this._backSprite = new Sprite();
        this._backSprite.addChild(new TilingSprite());
        this._container.addChild(this._backSprite);
    };

    public _createFrameSprite() {
        this._frameSprite = new Sprite();
        for (let i = 0; i < 8; i++) {
            this._frameSprite.addChild(new Sprite());
        }
        this._container.addChild(this._frameSprite);
    };

    public _createClientArea() {
        this._clientArea = new Sprite();
        this._clientArea.filters = [new PIXI.filters.AlphaFilter()];
        this._clientArea.filterArea = new Rectangle();
        this._clientArea.move(this._padding, this._padding);
        this.addChild(this._clientArea);
    };

    public _createContentsBackSprite() {
        this._contentsBackSprite = new Sprite();
        this._clientArea.addChild(this._contentsBackSprite);
    };

    public _createCursorSprite() {
        this._cursorSprite = new Sprite();
        for (let i = 0; i < 9; i++) {
            this._cursorSprite.addChild(new Sprite());
        }
        this._clientArea.addChild(this._cursorSprite);
    };

    public _createContentsSprite() {
        this._contentsSprite = new Sprite();
        this._clientArea.addChild(this._contentsSprite);
    };

    public _createArrowSprites() {
        this._downArrowSprite = new Sprite();
        this.addChild(this._downArrowSprite);
        this._upArrowSprite = new Sprite();
        this.addChild(this._upArrowSprite);
    };

    public _createPauseSignSprites() {
        this._pauseSignSprite = new Sprite();
        this.addChild(this._pauseSignSprite);
    };

    public _onWindowskinLoad() {
        this._refreshAllParts();
    };

    public _refreshAllParts() {
        this._refreshBack();
        this._refreshFrame();
        this._refreshCursor();
        this._refreshArrows();
        this._refreshPauseSign();
    };

    public _refreshBack() {
        const m = this._margin;
        const w = Math.max(0, this._width - m * 2);
        const h = Math.max(0, this._height - m * 2);
        const sprite = this._backSprite;
        const tilingSprite = sprite.children[0];
        sprite.bitmap = this._windowskin;
        sprite.setFrame(0, 0, 96, 96);
        sprite.move(m, m);
        sprite.scale.x = w / 96;
        sprite.scale.y = h / 96;
        tilingSprite.bitmap = this._windowskin;
        tilingSprite.setFrame(0, 96, 96, 96);
        tilingSprite.move(0, 0, w, h);
        tilingSprite.scale.x = 96 / w;
        tilingSprite.scale.y = 96 / h;
        sprite.setColorTone(this._colorTone);
    };

    public _refreshFrame() {
        const drect = { x: 0, y: 0, width: this._width, height: this._height };
        const srect = { x: 96, y: 0, width: 96, height: 96 };
        const m = 24;
        for (const child of this._frameSprite.children) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this._frameSprite, srect, drect, m);
    };

    public _refreshCursor() {
        const drect = this._cursorRect.clone();
        const srect = { x: 96, y: 96, width: 48, height: 48 };
        const m = 4;
        for (const child of this._cursorSprite.children) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this._cursorSprite, srect, drect, m);
    };

    public _setRectPartsGeometry(sprite: Sprite, srect: { x: number, y: number, width: number, height: number }, drect: { x: number, y: number, width: number, height: number }, m: number) {
        const sx = srect.x;
        const sy = srect.y;
        const sw = srect.width;
        const sh = srect.height;
        const dx = drect.x;
        const dy = drect.y;
        const dw = drect.width;
        const dh = drect.height;
        const smw = sw - m * 2;
        const smh = sh - m * 2;
        const dmw = dw - m * 2;
        const dmh = dh - m * 2;
        const children = sprite.children;
        sprite.setFrame(0, 0, dw, dh);
        sprite.move(dx, dy);
        // corner
        children[0].setFrame(sx, sy, m, m);
        children[1].setFrame(sx + sw - m, sy, m, m);
        children[2].setFrame(sx, sy + sw - m, m, m);
        children[3].setFrame(sx + sw - m, sy + sw - m, m, m);
        children[0].move(0, 0);
        children[1].move(dw - m, 0);
        children[2].move(0, dh - m);
        children[3].move(dw - m, dh - m);
        // edge
        children[4].move(m, 0);
        children[5].move(m, dh - m);
        children[6].move(0, m);
        children[7].move(dw - m, m);
        children[4].setFrame(sx + m, sy, smw, m);
        children[5].setFrame(sx + m, sy + sw - m, smw, m);
        children[6].setFrame(sx, sy + m, m, smh);
        children[7].setFrame(sx + sw - m, sy + m, m, smh);
        children[4].scale.x = dmw / smw;
        children[5].scale.x = dmw / smw;
        children[6].scale.y = dmh / smh;
        children[7].scale.y = dmh / smh;
        // center
        if (children[8]) {
            children[8].setFrame(sx + m, sy + m, smw, smh);
            children[8].move(m, m);
            children[8].scale.x = dmw / smw;
            children[8].scale.y = dmh / smh;
        }
        for (const child of children) {
            child.visible = dw > 0 && dh > 0;
        }
    };

    public _refreshArrows() {
        const w = this._width;
        const h = this._height;
        const p = 24;
        const q = p / 2;
        const sx = 96 + p;
        const sy = 0 + p;
        this._downArrowSprite.bitmap = this._windowskin;
        this._downArrowSprite.anchor.x = 0.5;
        this._downArrowSprite.anchor.y = 0.5;
        this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
        this._downArrowSprite.move(w / 2, h - q);
        this._upArrowSprite.bitmap = this._windowskin;
        this._upArrowSprite.anchor.x = 0.5;
        this._upArrowSprite.anchor.y = 0.5;
        this._upArrowSprite.setFrame(sx + q, sy, p, q);
        this._upArrowSprite.move(w / 2, q);
    };

    public _refreshPauseSign() {
        const sx = 144;
        const sy = 96;
        const p = 24;
        this._pauseSignSprite.bitmap = this._windowskin;
        this._pauseSignSprite.anchor.x = 0.5;
        this._pauseSignSprite.anchor.y = 1;
        this._pauseSignSprite.move(this._width / 2, this._height);
        this._pauseSignSprite.setFrame(sx, sy, p, p);
        this._pauseSignSprite.alpha = 0;
    };

    public _updateClientArea() {
        const pad = this._padding;
        this._clientArea.move(pad, pad);
        this._clientArea.x = pad - this.origin.x;
        this._clientArea.y = pad - this.origin.y;
        if (this.innerWidth > 0 && this.innerHeight > 0) {
            this._clientArea.visible = this.isOpen();
        } else {
            this._clientArea.visible = false;
        }
    };

    public _updateFrame() {
        this._frameSprite.visible = this.frameVisible;
    };

    public _updateContentsBack() {
        const bitmap = this._contentsBackSprite.bitmap;
        if (bitmap) {
            this._contentsBackSprite.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    };

    public _updateCursor() {
        this._cursorSprite.alpha = this._makeCursorAlpha();
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y;
    };

    public _makeCursorAlpha() {
        const blinkCount = this._animationCount % 40;
        const baseAlpha = this.contentsOpacity / 255;
        if (this.active) {
            if (blinkCount < 20) {
                return baseAlpha - blinkCount / 32;
            } else {
                return baseAlpha - (40 - blinkCount) / 32;
            }
        }
        return baseAlpha;
    };

    public _updateContents() {
        const bitmap = this._contentsSprite.bitmap;
        if (bitmap) {
            this._contentsSprite.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    };

    public _updateArrows() {
        this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
        this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
    };

    public _updatePauseSign() {
        const sprite = this._pauseSignSprite;
        const x = Math.floor(this._animationCount / 16) % 2;
        const y = Math.floor(this._animationCount / 16 / 2) % 2;
        const sx = 144;
        const sy = 96;
        const p = 24;
        if (!this.pause) {
            sprite.alpha = 0;
        } else if (sprite.alpha < 1) {
            sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
        }
        sprite.setFrame(sx + x * p, sy + y * p, p, p);
        sprite.visible = this.isOpen();
    };

    public _updateFilterArea() {
        const pos = this._clientArea.worldTransform.apply(new Point(0, 0));
        const filterArea = this._clientArea.filterArea;
        filterArea.x = pos.x + this.origin.x;
        filterArea.y = pos.y + this.origin.y;
        filterArea.width = this.innerWidth;
        filterArea.height = this.innerHeight;
    };
}




