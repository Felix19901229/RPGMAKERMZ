import { Graphics, Rectangle, Utils } from "./index.js";
export class Bitmap {
    _canvas;
    _context;
    _baseTexture;
    _paintOpacity;
    _url;
    _smooth;
    _loadingState;
    fontFace;
    fontSize;
    fontBold;
    fontItalic;
    textColor;
    outlineColor;
    outlineWidth;
    _loadListeners;
    _image;
    get url() {
        return this._url;
    }
    get baseTexture() {
        return this._baseTexture;
    }
    get image() {
        return this._image;
    }
    get canvas() {
        this._ensureCanvas();
        return this._canvas;
    }
    get context() {
        this._ensureCanvas();
        return this._context;
    }
    get width() {
        const image = this._canvas || this._image;
        return image ? image.width : 0;
    }
    get height() {
        const image = this._canvas || this._image;
        return image ? image.height : 0;
    }
    get rect() {
        return new Rectangle(0, 0, this.width, this.height);
    }
    get smooth() {
        return this._smooth;
    }
    set smooth(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            this._updateScaleMode();
        }
    }
    get paintOpacity() {
        return this._paintOpacity;
    }
    set paintOpacity(value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this.context.globalAlpha = this._paintOpacity / 255;
        }
    }
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(width, height) {
        this._canvas = null;
        this._context = null;
        this._baseTexture = null;
        this._image = null;
        this._url = "";
        this._paintOpacity = 255;
        this._smooth = true;
        this._loadListeners = [];
        this._loadingState = "none";
        if (width > 0 && height > 0) {
            this._createCanvas(width, height);
        }
        this.fontFace = "sans-serif";
        this.fontSize = 16;
        this.fontBold = false;
        this.fontItalic = false;
        this.textColor = "#ffffff";
        this.outlineColor = "rgba(0, 0, 0, 0.5)";
        this.outlineWidth = 3;
    }
    static load(url) {
        const bitmap = Object.create(Bitmap.prototype);
        bitmap.initialize();
        bitmap._url = url;
        bitmap._startLoading();
        return bitmap;
    }
    static snap(stage) {
        const width = Graphics.width;
        const height = Graphics.height;
        const bitmap = new Bitmap(width, height);
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
        renderTexture.destroy(true);
        bitmap.baseTexture.update();
        return bitmap;
    }
    isReady() {
        return this._loadingState === "loaded" || this._loadingState === "none";
    }
    isError() {
        return this._loadingState === "error";
    }
    destroy() {
        if (this._baseTexture) {
            this._baseTexture.destroy();
            this._baseTexture = null;
        }
        this._destroyCanvas();
    }
    resize(width, height) {
        width = Math.max(width || 0, 1);
        height = Math.max(height || 0, 1);
        this.canvas.width = width;
        this.canvas.height = height;
        this.baseTexture.setSize(width, height);
    }
    blt(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        dw = dw || sw;
        dh = dh || sh;
        try {
            const image = source._canvas || source._image;
            this.context.globalCompositeOperation = "source-over";
            this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
            this._baseTexture.update();
        }
        catch (e) {
        }
    }
    getPixel(x, y) {
        const data = this.context.getImageData(x, y, 1, 1).data;
        let result = "#";
        for (let i = 0; i < 3; i++) {
            result += data[i].toString(16).padZero(2);
        }
        return result;
    }
    getAlphaPixel(x, y) {
        const data = this.context.getImageData(x, y, 1, 1).data;
        return data[3];
    }
    clearRect(x, y, width, height) {
        this.context.clearRect(x, y, width, height);
        this._baseTexture.update();
    }
    clear() {
        this.clearRect(0, 0, this.width, this.height);
    }
    fillRect(x, y, width, height, color) {
        const context = this.context;
        context.save();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.restore();
        this._baseTexture.update();
    }
    fillAll(color) {
        this.fillRect(0, 0, this.width, this.height, color);
    }
    strokeRect(x, y, width, height, color) {
        const context = this.context;
        context.save();
        context.strokeStyle = color;
        context.strokeRect(x, y, width, height);
        context.restore();
        this._baseTexture.update();
    }
    gradientFillRect(x, y, width, height, color1, color2, vertical) {
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
    drawCircle(x, y, radius, color) {
        const context = this.context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        this._baseTexture.update();
    }
    drawText(text, x, y, maxWidth, lineHeight, align) {
        const context = this.context;
        const alpha = context.globalAlpha;
        maxWidth = maxWidth || 0xffffffff;
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
    measureTextWidth(text) {
        const context = this.context;
        context.save();
        context.font = this._makeFontNameText();
        const width = context.measureText(text).width;
        context.restore();
        return width;
    }
    addLoadListener(listner) {
        if (!this.isReady()) {
            this._loadListeners.push(listner);
        }
        else {
            listner(this);
        }
    }
    retry() {
        this._startLoading();
    }
    _makeFontNameText() {
        const italic = this.fontItalic ? "Italic " : "";
        const bold = this.fontBold ? "Bold " : "";
        return italic + bold + this.fontSize + "px " + this.fontFace;
    }
    _drawTextOutline(text, tx, ty, maxWidth) {
        const context = this.context;
        context.strokeStyle = this.outlineColor;
        context.lineWidth = this.outlineWidth;
        context.lineJoin = "round";
        context.strokeText(text, tx, ty, maxWidth);
    }
    _drawTextBody(text, tx, ty, maxWidth) {
        const context = this.context;
        context.fillStyle = this.textColor;
        context.fillText(text, tx, ty, maxWidth);
    }
    _createCanvas(width, height) {
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d");
        this._canvas.width = width;
        this._canvas.height = height;
        this._createBaseTexture(this._canvas);
    }
    _ensureCanvas() {
        if (!this._canvas) {
            if (this._image) {
                this._createCanvas(this._image.width, this._image.height);
                this._context.drawImage(this._image, 0, 0);
            }
            else {
                this._createCanvas(0, 0);
            }
        }
    }
    _destroyCanvas() {
        if (this._canvas) {
            this._canvas.width = 0;
            this._canvas.height = 0;
            this._canvas = null;
        }
    }
    _createBaseTexture(source) {
        this._baseTexture = new PIXI.BaseTexture(source);
        this._baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF;
        this._baseTexture.setSize(source.width, source.height);
        this._updateScaleMode();
    }
    _updateScaleMode() {
        if (this._baseTexture) {
            if (this._smooth) {
                this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
            }
            else {
                this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            }
        }
    }
    _startLoading() {
        this._image = new Image();
        this._image.onload = this._onLoad.bind(this);
        this._image.onerror = this._onError.bind(this);
        this._destroyCanvas();
        this._loadingState = "loading";
        if (Utils.hasEncryptedImages()) {
            this._startDecrypting();
        }
        else {
            this._image.src = this._url;
        }
    }
    _startDecrypting() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this._url + "_");
        xhr.responseType = "arraybuffer";
        xhr.onload = () => this._onXhrLoad(xhr);
        xhr.onerror = this._onError.bind(this);
        xhr.send();
    }
    _onXhrLoad(xhr) {
        if (xhr.status < 400) {
            const arrayBuffer = Utils.decryptArrayBuffer(xhr.response);
            const blob = new Blob([arrayBuffer]);
            this._image.src = URL.createObjectURL(blob);
        }
        else {
            this._onError();
        }
    }
    _onLoad() {
        if (Utils.hasEncryptedImages()) {
            URL.revokeObjectURL(this._image.src);
        }
        this._loadingState = "loaded";
        this._createBaseTexture(this._image);
        this._callLoadListeners();
    }
    _callLoadListeners() {
        while (this._loadListeners.length > 0) {
            const listener = this._loadListeners.shift();
            listener(this);
        }
    }
    _onError() {
        this._loadingState = "error";
    }
}
