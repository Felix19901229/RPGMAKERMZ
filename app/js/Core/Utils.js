export class Utils {
    static _audioElement;
    static _videoElement;
    static _hasEncryptedImages;
    static _hasEncryptedAudio;
    static _encryptionKey;
    constructor() {
        throw new Error("This is a static class");
    }
    static RPGMAKER_NAME = "MZ";
    static RPGMAKER_VERSION = "1.0.0";
    static checkRMVersion(version) {
        const array1 = this.RPGMAKER_VERSION.split(".");
        const array2 = String(version).split(".");
        for (let i = 0; i < array1.length; i++) {
            const v1 = parseInt(array1[i]);
            const v2 = parseInt(array2[i]);
            if (v1 > v2) {
                return true;
            }
            else if (v1 < v2) {
                return false;
            }
        }
        return true;
    }
    static isOptionValid(name) {
        const args = location.search.slice(1);
        if (args.split("&").includes(name)) {
            return true;
        }
        if (this.isNwjs() && nw.App.argv.length > 0) {
            return nw.App.argv[0].split("&").includes(name);
        }
        return false;
    }
    static isNwjs() {
        return typeof require === "function" && typeof process === "object";
    }
    static isMobileDevice() {
        const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i;
        return !!navigator.userAgent.match(r);
    }
    static isMobileSafari() {
        const agent = navigator.userAgent;
        return !!(agent.match(/iPhone|iPad|iPod/) &&
            agent.match(/AppleWebKit/) &&
            !agent.match("CriOS"));
    }
    static isAndroidChrome() {
        const agent = navigator.userAgent;
        return !!(agent.match(/Android/) && agent.match(/Chrome/));
    }
    static isLocal() {
        return window.location.href.startsWith("file:");
    }
    static canUseWebGL() {
        try {
            const canvas = document.createElement("canvas");
            return !!canvas.getContext("webgl");
        }
        catch (e) {
            return false;
        }
    }
    static canUseWebAudioAPI() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }
    static canUseCssFontLoading() {
        return !!(document.fonts && document.fonts.ready);
    }
    static canUseIndexedDB() {
        return !!(window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB);
    }
    static canPlayOgg() {
        if (!Utils._audioElement) {
            Utils._audioElement = document.createElement("audio");
        }
        return !!(Utils._audioElement &&
            Utils._audioElement.canPlayType('audio/ogg; codecs="vorbis"'));
    }
    static canPlayWebm() {
        if (!Utils._videoElement) {
            Utils._videoElement = document.createElement("video");
        }
        return !!(Utils._videoElement &&
            Utils._videoElement.canPlayType('video/webm; codecs="vp8, vorbis"'));
    }
    static encodeURI(str) {
        return encodeURIComponent(str).replace(/%2F/g, "/");
    }
    static escapeHtml(str) {
        const entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;"
        };
        return String(str).replace(/[&<>"'/]/g, s => entityMap[s]);
    }
    static containsArabic(str) {
        const regExp = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        return regExp.test(str);
    }
    static setEncryptionInfo(hasImages, hasAudio, key) {
        this._hasEncryptedImages = hasImages;
        this._hasEncryptedAudio = hasAudio;
        this._encryptionKey = key;
    }
    static hasEncryptedImages() {
        return this._hasEncryptedImages;
    }
    static hasEncryptedAudio() {
        return this._hasEncryptedAudio;
    }
    static decryptArrayBuffer(source) {
        const header = new Uint8Array(source, 0, 16);
        const headerHex = Array.from(header, x => x.toString(16)).join(",");
        if (headerHex !== "52,50,47,4d,56,0,0,0,0,3,1,0,0,0,0,0") {
            throw new Error("Decryption error");
        }
        const body = source.slice(16);
        const view = new DataView(body);
        const key = this._encryptionKey.match(/.{2}/g);
        for (let i = 0; i < 16; i++) {
            view.setUint8(i, view.getUint8(i) ^ parseInt(key[i], 16));
        }
        return body;
    }
}
