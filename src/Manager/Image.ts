import { Bitmap, Utils } from "../Core/index.js";
//-----------------------------------------------------------------------------
/**
 * ImageManager
 * 
 * The static class that loads images, creates bitmap objects and retains them.
*/
export class ImageManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static iconWidth = 32;
    static iconHeight = 32;
    static faceWidth = 144;
    static faceHeight = 144;

    static _cache: { [K: string]: Bitmap } = {};
    static _system:{ [K: string]: Bitmap }  = {};
    static _emptyBitmap = new Bitmap(1, 1);

    static loadAnimation(filename: string) {
        return this.loadBitmap("img/animations/", filename);
    };

    static loadBattleback1(filename: string) {
        return this.loadBitmap("img/battlebacks1/", filename);
    };

    static loadBattleback2(filename: string) {
        return this.loadBitmap("img/battlebacks2/", filename);
    };

    static loadEnemy(filename: string) {
        return this.loadBitmap("img/enemies/", filename);
    };

    static loadCharacter(filename: string) {
        return this.loadBitmap("img/characters/", filename);
    };

    static loadFace(filename: string) {
        return this.loadBitmap("img/faces/", filename);
    };

    static loadParallax(filename: string) {
        return this.loadBitmap("img/parallaxes/", filename);
    };

    static loadPicture(filename: string) {
        return this.loadBitmap("img/pictures/", filename);
    };

    static loadSvActor(filename: string) {
        return this.loadBitmap("img/sv_actors/", filename);
    };

    static loadSvEnemy(filename: string) {
        return this.loadBitmap("img/sv_enemies/", filename);
    };

    static loadSystem(filename: string) {
        return this.loadBitmap("img/system/", filename);
    };

    static loadTileset(filename: string) {
        return this.loadBitmap("img/tilesets/", filename);
    };

    static loadTitle1(filename: string) {
        return this.loadBitmap("img/titles1/", filename);
    };

    static loadTitle2(filename: string) {
        return this.loadBitmap("img/titles2/", filename);
    };

    static loadBitmap(folder: string, filename: string) {
        if (filename) {
            const url = folder + Utils.encodeURI(filename) + ".png";
            return this.loadBitmapFromUrl(url);
        } else {
            return this._emptyBitmap;
        }
    };

    static loadBitmapFromUrl(url: string) {
        const cache = url.includes("/system/") ? this._system : this._cache;
        if (!cache[url]) {
            cache[url] = Bitmap.load(url);
        }
        return cache[url];
    };

    static clear() {
        const cache = this._cache;
        for (const url in cache) {
            cache[url].destroy();
        }
        this._cache = {};
    };

    static isReady() {
        for (const cache of [this._cache, this._system]) {
            for (const url in cache) {
                const bitmap = cache[url];
                if (bitmap.isError()) {
                    this.throwLoadError(bitmap);
                }
                if (!bitmap.isReady()) {
                    return false;
                }
            }
        }
        return true;
    };

    static throwLoadError(bitmap:Bitmap) {
        const retry = bitmap.retry.bind(bitmap);
        throw ["LoadError", bitmap.url, retry];
    };

    static isObjectCharacter(filename:string) {
        const sign = filename.match(/^[!$]+/);
        return sign && sign[0].includes("!");
    };

    static isBigCharacter(filename:string) {
        const sign = filename.match(/^[!$]+/);
        return sign && sign[0].includes("$");
    };

    static isZeroParallax(filename:string) {
        return filename.charAt(0) === "!";
    };
}