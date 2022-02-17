export class JsonEx {
    constructor() {
        throw new Error("This is a static class");
    }
    static maxDepth = 100;
    static stringify(object) {
        return JSON.stringify(this._encode(object, 0));
    }
    static parse(json) {
        return this._decode(JSON.parse(json));
    }
    static makeDeepCopy(object) {
        return this.parse(this.stringify(object));
    }
    static _encode(value, depth) {
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
                const constructor = window[value["@"]];
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
