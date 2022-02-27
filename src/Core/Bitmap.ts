
import { Graphics, Rectangle, Utils } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * The basic object that represents an image.
 *
 * @class
 * @param {number} width - The width of the bitmap.
 * @param {number} height - The height of the bitmap.
 */
export class Bitmap {
    _canvas: HTMLCanvasElement;
    _context: CanvasRenderingContext2D;
    _baseTexture: PIXI.BaseTexture;
    _paintOpacity: number;
    _url: string;
    _smooth: boolean;
    _loadingState: "none"| "loading"| "loaded"| "error";
    fontFace: string;
    fontSize: number;
    fontBold: boolean;
    fontItalic: boolean;
    textColor: string;
    outlineColor: string;
    outlineWidth: number;
    _loadListeners: Function[];
    _image: HTMLImageElement;
    /**
     * The url of the image file.
     *
     * @readonly
     * @type string
     * @name Bitmap#url
     */
    get url() {
        return this._url;
    }

    /**
     * The base texture that holds the image.
     *
     * @readonly
     * @type PIXI.BaseTexture
     * @name Bitmap#baseTexture
     */
    //@ts-ignore
    get baseTexture() {
        return this._baseTexture;
    }

    /**
     * The bitmap image.
     *
     * @readonly
     * @type HTMLImageElement
     * @name Bitmap#image
     */
    get image() {
        return this._image;
    }


    /**
     * The bitmap canvas.
     *
     * @readonly
     * @type HTMLCanvasElement
     * @name Bitmap#canvas
     */
    get canvas() {
        this._ensureCanvas();
        return this._canvas;
    }

    /**
     * The 2d context of the bitmap canvas.
     *
     * @readonly
     * @type CanvasRenderingContext2D
     * @name Bitmap#context
     */

    get context() {
        this._ensureCanvas();
        return this._context;
    }

    /**
     * The width of the bitmap.
     *
     * @readonly
     * @type number
     * @name Bitmap#width
     */
    //@ts-ignore
    get width() {
        const image = this._canvas || this._image;
        return image ? image.width : 0;
    }

    /**
     * The height of the bitmap.
     *
     * @readonly
     * @type number
     * @name Bitmap#height
     */
    //@ts-ignore
    get height() {
        const image = this._canvas || this._image;
        return image ? image.height : 0;
    }

    /**
     * The rectangle of the bitmap.
     *
     * @readonly
     * @type Rectangle
     * @name Bitmap#rect
     */

    get rect() {
        return new Rectangle(0, 0, this.width, this.height);
    }


    /**
     * Whether the smooth scaling is applied.
     *
     * @type boolean
     * @name Bitmap#smooth
     */

    get smooth() {
        return this._smooth;
    }
    set smooth(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            this._updateScaleMode();
        }
    }

    /**
     * The opacity of the drawing object in the range (0, 255).
     *
     * @type number
     * @name Bitmap#paintOpacity
     */

    get paintOpacity() {
        return this._paintOpacity;
    }
    set paintOpacity(value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this.context.globalAlpha = this._paintOpacity / 255;
        }
    }


    constructor(...args: [number, number]) {
        this.initialize(...args);
    }
    public initialize(width: number, height: number) {
        this._canvas = null;
        this._context = null;
        this._baseTexture = null;
        this._image = null;
        this._url = "";
        this._paintOpacity = 255;
        this._smooth = true;
        this._loadListeners = [];
    
        // "none", "loading", "loaded", or "error"
        this._loadingState = "none";

        if (width > 0 && height > 0) {
            this._createCanvas(width, height);
        }

        /**
         * The face name of the font.
         *
         * @type string
         */
        this.fontFace = "sans-serif";

        /**
         * The size of the font in pixels.
         *
         * @type number
         */
        this.fontSize = 16;

        /**
         * Whether the font is bold.
         *
         * @type boolean
         */
        this.fontBold = false;

        /**
         * Whether the font is italic.
         *
         * @type boolean
         */
        this.fontItalic = false;

        /**
         * The color of the text in CSS format.
         *
         * @type string
         */
        this.textColor = "#ffffff";

        /**
         * The color of the outline of the text in CSS format.
         *
         * @type string
         */
        this.outlineColor = "rgba(0, 0, 0, 0.5)";

        /**
         * The width of the outline of the text.
         *
         * @type number
         */
        this.outlineWidth = 3;
    }

    /**
     * Loads a image file.
     *
     * @param {string} url - The image url of the texture.
     * @returns {Bitmap} The new bitmap object.
     */
    static load(url) :Bitmap{
        const bitmap = Object.create(Bitmap.prototype);
        bitmap.initialize();
        bitmap._url = url;
        bitmap._startLoading();
        return bitmap;
    }

    /**
     * Takes a snapshot of the game screen.
     *
     * @param {Stage} stage - The stage object.
     * @returns {Bitmap} The new bitmap object.
     */
    static snap(stage) {
        const width = Graphics.width;
        const height = Graphics.height;
        const bitmap = new Bitmap(width, height);
        // 错误
        // const renderTexture = PIXI.RenderTexture.create(width, height);
        const renderTexture = PIXI.RenderTexture.create({ width, height });
        if (stage) {
            const renderer = Graphics.app.renderer;
            renderer.render(stage, renderTexture);
            stage.worldTransform.identity();
            const canvas = renderer.extract.canvas(renderTexture);
            bitmap.context.drawImage(canvas, 0, 0);
            canvas.width = 0;
            canvas.height = 0;
        }
        //错误
        // renderTexture.destroy({ destroyBase: true });
        renderTexture.destroy(true);
        bitmap.baseTexture.update();
        return bitmap;
    }

    /**
     * Checks whether the bitmap is ready to render.
     *
     * @returns {boolean} True if the bitmap is ready to render.
     */public isReady() {
        return this._loadingState === "loaded" || this._loadingState === "none";
    }

    /**
     * Checks whether a loading error has occurred.
     *
     * @returns {boolean} True if a loading error has occurred.
     */public isError() {
        return this._loadingState === "error";
    }



    /**
     * Destroys the bitmap.
     */public destroy() {
        if (this._baseTexture) {
            this._baseTexture.destroy();
            this._baseTexture = null;
        }
        this._destroyCanvas();
    }

    /**
     * Resizes the bitmap.
     *
     * @param {number} width - The new width of the bitmap.
     * @param {number} height - The new height of the bitmap.
     */public resize(width, height) {
        width = Math.max(width || 0, 1);
        height = Math.max(height || 0, 1);
        this.canvas.width = width;
        this.canvas.height = height;
        // 错误,只读属性
        // this.baseTexture.width = width;
        // this.baseTexture.height = height;
        this.baseTexture.setSize(width, height);
    }

    /**
     * Performs a block transfer.
     *
     * @param {Bitmap} source - The bitmap to draw.
     * @param {number} sx - The x coordinate in the source.
     * @param {number} sy - The y coordinate in the source.
     * @param {number} sw - The width of the source image.
     * @param {number} sh - The height of the source image.
     * @param {number} dx - The x coordinate in the destination.
     * @param {number} dy - The y coordinate in the destination.
     * @param {number} [dw=sw] The width to draw the image in the destination.
     * @param {number} [dh=sh] The height to draw the image in the destination.
     */public blt(source, sx, sy, sw, sh, dx, dy, dw?, dh?) {
        dw = dw || sw;
        dh = dh || sh;
        try {
            const image = source._canvas || source._image;
            this.context.globalCompositeOperation = "source-over";
            this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
            this._baseTexture.update();
        } catch (e) {
            //
        }
    }

    /**
     * Returns pixel color at the specified point.
     *
     * @param {number} x - The x coordinate of the pixel in the bitmap.
     * @param {number} y - The y coordinate of the pixel in the bitmap.
     * @returns {string} The pixel color (hex format).
     */public getPixel(x, y) {
        const data = this.context.getImageData(x, y, 1, 1).data;
        let result = "#";
        for (let i = 0; i < 3; i++) {
            result += data[i].toString(16).padZero(2);
        }
        return result;
    }

    /**
     * Returns alpha pixel value at the specified point.
     *
     * @param {number} x - The x coordinate of the pixel in the bitmap.
     * @param {number} y - The y coordinate of the pixel in the bitmap.
     * @returns {string} The alpha value.
     */public getAlphaPixel(x, y) {
        const data = this.context.getImageData(x, y, 1, 1).data;
        return data[3];
    }

    /**
     * Clears the specified rectangle.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to clear.
     * @param {number} height - The height of the rectangle to clear.
     */public clearRect(x, y, width, height) {
        this.context.clearRect(x, y, width, height);
        this._baseTexture.update();
    }

    /**
     * Clears the entire bitmap.
     */public clear() {
        this.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Fills the specified rectangle.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to fill.
     * @param {number} height - The height of the rectangle to fill.
     * @param {string} color - The color of the rectangle in CSS format.
     */public fillRect(x, y, width, height, color) {
        const context = this.context;
        context.save();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.restore();
        this._baseTexture.update();
    }

    /**
     * Fills the entire bitmap.
     *
     * @param {string} color - The color of the rectangle in CSS format.
     */public fillAll(color) {
        this.fillRect(0, 0, this.width, this.height, color);
    }

    /**
     * Draws the specified rectangular frame.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to fill.
     * @param {number} height - The height of the rectangle to fill.
     * @param {string} color - The color of the rectangle in CSS format.
     */public strokeRect(x, y, width, height, color) {
        const context = this.context;
        context.save();
        context.strokeStyle = color;
        context.strokeRect(x, y, width, height);
        context.restore();
        this._baseTexture.update();
    }

    // prettier-ignore
    /**
     * Draws the rectangle with a gradation.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to fill.
     * @param {number} height - The height of the rectangle to fill.
     * @param {string} color1 - The gradient starting color.
     * @param {string} color2 - The gradient ending color.
     * @param {boolean} vertical - Whether the gradient should be draw as vertical or not.
     */
    public gradientFillRect(x, y, width, height, color1, color2, vertical?) {
        const context = this.context;
        const x1 = vertical ? x : x + width;
        const y1 = vertical ? y + height : y;
        const grad = context.createLinearGradient(x, y, x1, y1);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        context.save();
        context.fillStyle = grad;
        context.fillRect(x, y, width, height);
        context.restore();
        this._baseTexture.update();
    }

    /**
     * Draws a bitmap in the shape of a circle.
     *
     * @param {number} x - The x coordinate based on the circle center.
     * @param {number} y - The y coordinate based on the circle center.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The color of the circle in CSS format.
     */public drawCircle(x, y, radius, color) {
        const context = this.context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        this._baseTexture.update();
    }

    /**
     * Draws the outline text to the bitmap.
     *
     * @param {string} text - 文字
     * @param {number} x - 相对于画面X位置
     * @param {number} y - 相对于画面Y位置
     * @param {number} maxWidth - 绘制文本宽度
     * @param {number} lineHeight - 文本行高
     * @param {string} align - 文本水平位置 center end left right start，设置后会影响X
     */public drawText(text, x, y, maxWidth = 0xffffffff, lineHeight, align?:CanvasTextAlign) {
        // [Note] Different browser makes different rendering with
        //   textBaseline == 'top'. So we use 'alphabetic' here.
        const context = this.context;
        const alpha = context.globalAlpha;
        maxWidth = maxWidth;
        let tx = x;
        let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
        if (align === "center") {
            tx += maxWidth / 2;
        }
        if (align === "right") {
            tx += maxWidth;
        }
        context.save();
        context.font = this._makeFontNameText();
        context.textAlign = align;
        context.textBaseline = "alphabetic";
        context.globalAlpha = 1;
        this._drawTextOutline(text, tx, ty, maxWidth);
        context.globalAlpha = alpha;
        this._drawTextBody(text, tx, ty, maxWidth);
        context.restore();
        this._baseTexture.update();
    }

    /**
     * Returns the width of the specified text.
     *
     * @param {string} text - The text to be measured.
     * @returns {number} The width of the text in pixels.
     */public measureTextWidth(text) {
        const context = this.context;
        context.save();
        context.font = this._makeFontNameText();
        const width = context.measureText(text).width;
        context.restore();
        return width;
    }

    /**
     * Adds a callback function that will be called when the bitmap is loaded.
     *
     * @param {function} listner - The callback function.
     */
    public addLoadListener(listner: Function) {
        if (!this.isReady()) {
            this._loadListeners.push(listner);
        } else {
            listner(this);
        }
    }

    /**
     * Tries to load the image again.
     */
    public retry() {
        this._startLoading();
    }
    public _makeFontNameText() {
        const italic = this.fontItalic ? "Italic " : "";
        const bold = this.fontBold ? "Bold " : "";
        return italic + bold + this.fontSize + "px " + this.fontFace;
    }
    public _drawTextOutline(text, tx, ty, maxWidth) {
        const context = this.context;
        context.strokeStyle = this.outlineColor;
        context.lineWidth = this.outlineWidth;
        context.lineJoin = "round";
        context.strokeText(text, tx, ty, maxWidth);
    }
    public _drawTextBody(text, tx, ty, maxWidth) {
        const context = this.context;
        context.fillStyle = this.textColor;
        context.fillText(text, tx, ty, maxWidth);
    }
    public _createCanvas(width, height) {
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d");
        this._canvas.width = width;
        this._canvas.height = height;
        this._createBaseTexture(this._canvas);
    }
    public _ensureCanvas() {
        if (!this._canvas) {
            if (this._image) {
                this._createCanvas(this._image.width, this._image.height);
                this._context.drawImage(this._image, 0, 0);
            } else {
                this._createCanvas(0, 0);
            }
        }
    }
    public _destroyCanvas() {
        if (this._canvas) {
            this._canvas.width = 0;
            this._canvas.height = 0;
            this._canvas = null;
        }
    }
    public _createBaseTexture(source) {
        this._baseTexture = new PIXI.BaseTexture(source);
        //错误 mipmap是MIPMAP_MODES类型,不是boolean类型
        // this._baseTexture.mipmap = false;
        this._baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF;
        // 错误只读属性
        // this._baseTexture.width = source.width;
        // this._baseTexture.height = source.height;
        this._baseTexture.setSize(source.width, source.height)
        this._updateScaleMode();
    }
    public _updateScaleMode() {
        if (this._baseTexture) {
            if (this._smooth) {
                this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
            } else {
                this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            }
        }
    }
    public _startLoading() {
        this._image = new Image();
        this._image.onload = this._onLoad.bind(this);
        this._image.onerror = this._onError.bind(this);
        this._destroyCanvas();
        this._loadingState = "loading";
        if (Utils.hasEncryptedImages()) {
            this._startDecrypting();
        } else {
            this._image.src = this._url;
        }
    }
    public _startDecrypting() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this._url + "_");
        xhr.responseType = "arraybuffer";
        xhr.onload = () => this._onXhrLoad(xhr);
        xhr.onerror = this._onError.bind(this);
        xhr.send();
    }
    public _onXhrLoad(xhr) {
        if (xhr.status < 400) {
            const arrayBuffer = Utils.decryptArrayBuffer(xhr.response);
            const blob = new Blob([arrayBuffer]);
            this._image.src = URL.createObjectURL(blob);
        } else {
            this._onError();
        }
    }
    public _onLoad() {
        if (Utils.hasEncryptedImages()) {
            URL.revokeObjectURL(this._image.src);
        }
        this._loadingState = "loaded";
        this._createBaseTexture(this._image);
        this._callLoadListeners();
    }
    public _callLoadListeners() {
        while (this._loadListeners.length > 0) {
            const listener = this._loadListeners.shift();
            listener(this);
        }
    }
    public _onError() {
        this._loadingState = "error";
    }
}
