import { Utils } from "./index.js";
class FPSCounter {
    _tickCount;
    _frameTime;
    _frameStart;
    _lastLoop;
    _showFps;
    duration;
    fps;
    _boxDiv;
    _labelDiv;
    _numberDiv;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(...args) {
        this._tickCount = 0;
        this._frameTime = 100;
        this._frameStart = 0;
        this._lastLoop = performance.now() - 100;
        this._showFps = true;
        this.fps = 0;
        this.duration = 0;
        this._createElements();
        this._update();
    }
    startTick() {
        this._frameStart = performance.now();
    }
    endTick() {
        const time = performance.now();
        const thisFrameTime = time - this._lastLoop;
        this._frameTime += (thisFrameTime - this._frameTime) / 12;
        this.fps = 1000 / this._frameTime;
        this.duration = Math.max(0, time - this._frameStart);
        this._lastLoop = time;
        if (this._tickCount++ % 15 === 0) {
            this._update();
        }
    }
    switchMode() {
        if (this._boxDiv.style.display === "none") {
            this._boxDiv.style.display = "block";
            this._showFps = true;
        }
        else if (this._showFps) {
            this._showFps = false;
        }
        else {
            this._boxDiv.style.display = "none";
        }
        this._update();
    }
    _createElements() {
        this._boxDiv = document.createElement("div");
        this._labelDiv = document.createElement("div");
        this._numberDiv = document.createElement("div");
        this._boxDiv.id = "fpsCounterBox";
        this._labelDiv.id = "fpsCounterLabel";
        this._numberDiv.id = "fpsCounterNumber";
        this._boxDiv.style.display = "none";
        this._boxDiv.appendChild(this._labelDiv);
        this._boxDiv.appendChild(this._numberDiv);
        document.body.appendChild(this._boxDiv);
    }
    _update() {
        const count = this._showFps ? this.fps : this.duration;
        this._labelDiv.textContent = this._showFps ? "FPS" : "ms";
        this._numberDiv.textContent = count.toFixed(0);
    }
}
export class Graphics {
    static _width;
    static _height;
    static _defaultScale;
    static _realScale;
    static _wasLoading;
    static frameCount;
    static boxWidth;
    static boxHeight;
    static _tickHandler;
    static _fpsCounter;
    static _loadingSpinner;
    static _canvas;
    static _errorPrinter;
    static _app;
    static _effekseer;
    static _stretchEnabled;
    static get app() {
        return this._app;
    }
    static get effekseer() {
        return this._effekseer;
    }
    static get width() {
        return this._width;
    }
    static set width(value) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    }
    static get height() {
        return this._height;
    }
    static set height(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    }
    static get defaultScale() {
        return this._defaultScale;
    }
    static set defaultScale(value) {
        if (this._defaultScale !== value) {
            this._defaultScale = value;
            this._updateAllElements();
        }
    }
    constructor() {
        throw new Error("This is a static class");
    }
    static initialize() {
        this._width = 0;
        this._height = 0;
        this._defaultScale = 1;
        this._realScale = 1;
        this._errorPrinter = null;
        this._tickHandler = null;
        this._canvas = null;
        this._fpsCounter = null;
        this._loadingSpinner = null;
        this._stretchEnabled = this._defaultStretchMode();
        this._app = null;
        this._effekseer = null;
        this._wasLoading = false;
        this.frameCount = 0;
        this.boxWidth = this._width;
        this.boxHeight = this._height;
        this._updateRealScale();
        this._createAllElements();
        this._disableContextMenu();
        this._setupEventHandlers();
        this._createPixiApp();
        this._createEffekseerContext();
        return !!this._app;
    }
    static setTickHandler(handler) {
        this._tickHandler = handler;
    }
    static startGameLoop() {
        if (this._app) {
            this._app.start();
        }
    }
    static stopGameLoop() {
        if (this._app) {
            this._app.stop();
        }
    }
    static setStage(stage) {
        if (this._app) {
            this._app.stage = stage;
        }
    }
    static startLoading() {
        if (!document.getElementById("loadingSpinner")) {
            document.body.appendChild(this._loadingSpinner);
        }
    }
    static endLoading() {
        if (document.getElementById("loadingSpinner")) {
            document.body.removeChild(this._loadingSpinner);
            return true;
        }
        else {
            return false;
        }
    }
    static printError(name, message, error = null) {
        if (!this._errorPrinter) {
            this._createErrorPrinter();
        }
        this._errorPrinter.innerHTML = this._makeErrorHtml(name, message, error);
        this._wasLoading = this.endLoading();
        this._applyCanvasFilter();
    }
    static showRetryButton(retry) {
        const button = document.createElement("button");
        button.id = "retryButton";
        button.innerHTML = "Retry";
        button.ontouchstart = e => e.stopPropagation();
        button.onclick = () => {
            Graphics.eraseError();
            retry();
        };
        this._errorPrinter.appendChild(button);
        button.focus();
    }
    static eraseError() {
        if (this._errorPrinter) {
            this._errorPrinter.innerHTML = this._makeErrorHtml();
            if (this._wasLoading) {
                this.startLoading();
            }
        }
        this._clearCanvasFilter();
    }
    static pageToCanvasX(x) {
        if (this._canvas) {
            const left = this._canvas.offsetLeft;
            return Math.round((x - left) / this._realScale);
        }
        else {
            return 0;
        }
    }
    static pageToCanvasY(y) {
        if (this._canvas) {
            const top = this._canvas.offsetTop;
            return Math.round((y - top) / this._realScale);
        }
        else {
            return 0;
        }
    }
    static isInsideCanvas(x, y) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }
    static showScreen() {
        this._canvas.style.opacity = "1";
    }
    static hideScreen() {
        this._canvas.style.opacity = "0";
    }
    static resize(width, height) {
        this._width = width;
        this._height = height;
        this._updateAllElements();
    }
    static _createAllElements() {
        this._createErrorPrinter();
        this._createCanvas();
        this._createLoadingSpinner();
        this._createFPSCounter();
    }
    static _updateAllElements() {
        this._updateRealScale();
        this._updateErrorPrinter();
        this._updateCanvas();
        this._updateVideo();
    }
    static _onTick(deltaTime) {
        this._fpsCounter.startTick();
        if (this._tickHandler) {
            this._tickHandler(deltaTime);
        }
        if (this._canRender()) {
            this._app.render();
        }
        this._fpsCounter.endTick();
    }
    static _canRender() {
        return !!this._app.stage;
    }
    static _updateRealScale() {
        if (this._stretchEnabled && this._width > 0 && this._height > 0) {
            const h = this._stretchWidth() / this._width;
            const v = this._stretchHeight() / this._height;
            this._realScale = Math.min(h, v);
            window.scrollTo(0, 0);
        }
        else {
            this._realScale = this._defaultScale;
        }
    }
    static _stretchWidth() {
        if (Utils.isMobileDevice()) {
            return document.documentElement.clientWidth;
        }
        else {
            return window.innerWidth;
        }
    }
    static _stretchHeight() {
        if (Utils.isMobileDevice()) {
            const rate = Utils.isLocal() ? 1.0 : 0.9;
            return document.documentElement.clientHeight * rate;
        }
        else {
            return window.innerHeight;
        }
    }
    static _makeErrorHtml(name = '', message = '', ...args) {
        const nameDiv = document.createElement("div");
        const messageDiv = document.createElement("div");
        nameDiv.id = "errorName";
        messageDiv.id = "errorMessage";
        nameDiv.innerHTML = Utils.escapeHtml(name);
        messageDiv.innerHTML = Utils.escapeHtml(message);
        return nameDiv.outerHTML + messageDiv.outerHTML;
    }
    static _defaultStretchMode() {
        return Utils.isNwjs() || Utils.isMobileDevice();
    }
    static _createErrorPrinter() {
        this._errorPrinter = document.createElement("div");
        this._errorPrinter.id = "errorPrinter";
        this._errorPrinter.innerHTML = this._makeErrorHtml();
        document.body.appendChild(this._errorPrinter);
    }
    static _updateErrorPrinter() {
        const width = 640 * this._realScale;
        const height = 100 * this._realScale;
        this._errorPrinter.style.width = width + "px";
        this._errorPrinter.style.height = height + "px";
    }
    static _createCanvas() {
        this._canvas = document.createElement("canvas");
        this._canvas.id = "gameCanvas";
        this._updateCanvas();
        document.body.appendChild(this._canvas);
    }
    static _updateCanvas() {
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._canvas.style.zIndex = "1";
        this._centerElement(this._canvas);
    }
    static _updateVideo() {
        const width = this._width * this._realScale;
        const height = this._height * this._realScale;
        Video.resize(width, height);
    }
    static _createLoadingSpinner() {
        const loadingSpinner = document.createElement("div");
        const loadingSpinnerImage = document.createElement("div");
        loadingSpinner.id = "loadingSpinner";
        loadingSpinnerImage.id = "loadingSpinnerImage";
        loadingSpinner.appendChild(loadingSpinnerImage);
        this._loadingSpinner = loadingSpinner;
    }
    static _createFPSCounter() {
        this._fpsCounter = new FPSCounter();
    }
    static _centerElement(element) {
        const width = element.width * this._realScale;
        const height = element.height * this._realScale;
        element.style.position = "absolute";
        element.style.margin = "auto";
        element.style.top = 0;
        element.style.left = 0;
        element.style.right = 0;
        element.style.bottom = 0;
        element.style.width = width + "px";
        element.style.height = height + "px";
    }
    static _disableContextMenu() {
        const elements = document.body.getElementsByTagName("*");
        const oncontextmenu = () => false;
        for (const element of elements) {
            element.oncontextmenu = oncontextmenu;
        }
    }
    static _applyCanvasFilter() {
        if (this._canvas) {
            this._canvas.style.opacity = "0.5";
            this._canvas.style.filter = "blur(8px)";
            this._canvas.style.webkitFilter = "blur(8px)";
        }
    }
    static _clearCanvasFilter() {
        if (this._canvas) {
            this._canvas.style.opacity = "1";
            this._canvas.style.filter = "";
            this._canvas.style.webkitFilter = "";
        }
    }
    static _setupEventHandlers() {
        window.addEventListener("resize", this._onWindowResize.bind(this));
        document.addEventListener("keydown", this._onKeyDown.bind(this));
    }
    static _onWindowResize() {
        this._updateAllElements();
    }
    static _onKeyDown(event) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 113:
                    event.preventDefault();
                    this._switchFPSCounter();
                    break;
                case 114:
                    event.preventDefault();
                    this._switchStretchMode();
                    break;
                case 115:
                    event.preventDefault();
                    this._switchFullScreen();
                    break;
            }
        }
    }
    static _switchFPSCounter() {
        this._fpsCounter.switchMode();
    }
    static _switchStretchMode() {
        this._stretchEnabled = !this._stretchEnabled;
        this._updateAllElements();
    }
    static _switchFullScreen() {
        if (this._isFullScreen()) {
            this._cancelFullScreen();
        }
        else {
            this._requestFullScreen();
        }
    }
    static _isFullScreen() {
        return (document.fullscreenElement ||
            document.mozFullScreen ||
            document.webkitFullscreenElement);
    }
    static _requestFullScreen() {
        const element = document.body;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }
    static _cancelFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
    static _createPixiApp() {
        try {
            this._setupPixi();
            this._app = new PIXI.Application({
                view: this._canvas,
                autoStart: false
            });
            this._app.ticker.remove(this._app.render, this._app);
            this._app.ticker.add(this._onTick, this);
        }
        catch (e) {
            this._app = null;
        }
    }
    static _setupPixi() {
        PIXI.utils.skipHello();
        PIXI.settings.GC_MAX_IDLE = 600;
    }
    static _createEffekseerContext() {
        if (this._app && window.effekseer) {
            try {
                this._effekseer = effekseer.createContext();
                if (this._effekseer) {
                    this._effekseer.init(this._app.renderer.gl);
                }
            }
            catch (e) {
                this._app = null;
            }
        }
    }
}
