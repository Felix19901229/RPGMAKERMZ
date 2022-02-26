import { Utils } from "./Utils.js";
import { Graphics } from "./Graphics.js";
import { Point } from "./Point.js";
import { Rectangle } from "./Rectangle.js";
import { Bitmap } from "./Bitmap.js";
import { Sprite } from "./Sprite.js"
import { Tilemap } from "./Tilemap.js";
import { TilingSprite } from "./TilingSprite.js";
import { ScreenSprite } from "./ScreenSprite.js";
import { Window } from "./Window.js";
import { WindowLayer } from "./WindowLayer.js";
import { Weather } from "./Weather.js";
import { ColorFilter } from "./ColorFilter.js"
import { Stage } from "./Stage.js";
import { WebAudio } from "./WebAudio.js";
import { Video } from "./Video.js";
import { Input } from "./Input.js";
import { TouchInput } from "./TouchInput.js";
import * as Game from "../Game/index.js";
import * as Manager from "../Manager/index.js";
import * as Sprites from "../Spriteset/index.js";
import * as _Window from "../Window/index.js";
import * as Sence from "../Scene/index.js";
const CLASS = {
   Utils,
   Graphics,
   Point,
   Rectangle,
   Bitmap,
   Sprite,
   Tilemap,
   TilingSprite,
   ScreenSprite,
   Window,
   WindowLayer,
   Weather,
   ColorFilter,
   Stage,
   WebAudio,
   Video,
   Input,
   TouchInput,
   ...Game,
   ...Manager,
   ..._Window,
   ...Sprites,
   ...Sence,
}
//-----------------------------------------------------------------------------
/**
 * The static class that handles JSON with object information.
 *
 * @namespace
 */
export class JsonEx {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * The maximum depth of objects.
     *
     * @type number
     * @default 100
     */
    static maxDepth = 100;

    /**
     * Converts an object to a JSON string with object information.
     *
     * @param {object} object - The object to be converted.
     * @returns {string} The JSON string.
     */
    static stringify(object) {
        return JSON.stringify(this._encode(object, 0));
    }

    /**
     * Parses a JSON string and reconstructs the corresponding object.
     *
     * @param {string} json - The JSON string.
     * @returns {object} The reconstructed object.
     */
    static parse(json) {
        return this._decode(JSON.parse(json));
    }

    /**
     * Makes a deep copy of the specified object.
     *
     * @param {object} object - The object to be copied.
     * @returns {object} The copied object.
     */
    static makeDeepCopy(object) {
        return this.parse(this.stringify(object));
    }

    static _encode(value, depth) {
        // [Note] The handling code for circular references in certain versions of
        //   MV has been removed because it was too complicated and expensive.
        if (depth >= this.maxDepth) {
            throw new Error("Object too deep");
        }
        const type = Object.prototype.toString.call(value);
        if (type === "[object Object]" || type === "[object Array]") {
            const constructorName = value.constructor.name;
            if (constructorName !== "Object" && constructorName !== "Array") {
                value["@"] = constructorName;
            }
            for (const key of Object.keys(value)) {
                value[key] = this._encode(value[key], depth + 1);
            }
        }
        return value;
    }

    static _decode(value) {
        const type = Object.prototype.toString.call(value);
        if (type === "[object Object]" || type === "[object Array]") {
            if (value["@"]) {
                const constructor = CLASS[value["@"]];
                if (constructor) {
                    Object.setPrototypeOf(value, constructor.prototype);
                }
            }
            for (const key of Object.keys(value)) {
                value[key] = this._decode(value[key]);
            }
        }
        return value;
    }
}