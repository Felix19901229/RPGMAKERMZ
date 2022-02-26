import { Graphics } from "./index.js";
export class Video {
    static _volume;
    static _loading;
    static _element;
    constructor() {
        throw new Error("This is a static class");
    }
    static initialize(width, height) {
        this._element = null;
        this._loading = false;
        this._volume = 1;
        this._createElement();
        this._setupEventHandlers();
        this.resize(width, height);
    }
    static resize(width, height) {
        if (this._element) {
            this._element.style.width = width + "px";
            this._element.style.height = height + "px";
        }
    }
    static play(src) {
        this._element.src = src;
        this._element.onloadeddata = this._onLoad.bind(this);
        this._element.onerror = this._onError.bind(this);
        this._element.onended = this._onEnd.bind(this);
        this._element.load();
        this._loading = true;
    }
    static isPlaying() {
        return this._loading || this._isVisible();
    }
    static setVolume(volume) {
        this._volume = volume;
        if (this._element) {
            this._element.volume = this._volume;
        }
    }
    static _createElement() {
        this._element = document.createElement("video");
        this._element.id = "gameVideo";
        this._element.style.position = "absolute";
        this._element.style.margin = "auto";
        this._element.style.top = "0";
        this._element.style.left = "0";
        this._element.style.right = "0";
        this._element.style.bottom = "0";
        this._element.style.opacity = "0";
        this._element.style.zIndex = "2";
        this._element.setAttribute("playsinline", "");
        this._element.oncontextmenu = () => false;
        document.body.appendChild(this._element);
    }
    static _onLoad() {
        this._element.volume = this._volume;
        this._element.play();
        this._updateVisibility(true);
        this._loading = false;
    }
    static _onError() {
        this._updateVisibility(false);
        const retry = () => {
            this._element.load();
        };
        throw ["LoadError", this._element.src, retry];
    }
    static _onEnd() {
        this._updateVisibility(false);
    }
    static _updateVisibility(videoVisible) {
        if (videoVisible) {
            Graphics.hideScreen();
        }
        else {
            Graphics.showScreen();
        }
        this._element.style.opacity = videoVisible ? "1" : "0";
    }
    static _isVisible() {
        return Number(this._element.style.opacity) > 0;
    }
    static _setupEventHandlers() {
        const onUserGesture = this._onUserGesture.bind(this);
        document.addEventListener("keydown", onUserGesture);
        document.addEventListener("mousedown", onUserGesture);
        document.addEventListener("touchend", onUserGesture);
    }
    static _onUserGesture() {
        if (!this._element.src && this._element.paused) {
            this._element.play().catch(() => 0);
        }
    }
}
