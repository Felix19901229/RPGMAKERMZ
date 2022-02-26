import { Graphics, Utils } from "../Core/index.js";
//-----------------------------------------------------------------------------
/**
 * EffectManager
 * 
 * The static class that loads Effekseer effects.
*/
export class EffectManager {
    static _cache:{[url:string]:any} = {};
    static _errorUrls = [];
    constructor() {
        throw new Error("This is a static class");
    }


    static load(filename):Nullable<typeof this["_cache"]> {
        if (filename) {
            const url = this.makeUrl(filename);
            const cache = this._cache;
            if (!cache[url] && Graphics.effekseer) {
                this.startLoading(url);
            }
            return cache[url];
        } else {
            return null;
        }
    };

    static startLoading(url) {
        const onLoad = () => this.onLoad(url);
        const onError = (message, url) => this.onError(url);
        const effect = Graphics.effekseer.loadEffect(url, 1, onLoad, onError);
        this._cache[url] = effect;
        return effect;
    };

    static clear() {
        for (const url in this._cache) {
            const effect = this._cache[url];
            Graphics.effekseer.releaseEffect(effect);
        }
        this._cache = {};
    };

    static onLoad(...args:any[]/*url*/) {
        //
    };

    static onError(url) {
        this._errorUrls.push(url);
    };

    static makeUrl(filename) {
        return "effects/" + Utils.encodeURI(filename) + ".efkefc";
    };

    static checkErrors() {
        const url = this._errorUrls.shift();
        if (url) {
            this.throwLoadError(url);
        }
    };

    static throwLoadError(url) {
        const retry = () => this.startLoading(url);
        throw ["LoadError", url, retry];
    };

    static isReady() {
        this.checkErrors();
        for (const url in this._cache) {
            const effect = this._cache[url];
            if (!effect.isLoaded) {
                return false;
            }
        }
        return true;
    };
}

