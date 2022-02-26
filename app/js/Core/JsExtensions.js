"use strict";
Array.prototype.clone = function () {
    return this.slice(0);
};
Object.defineProperty(Array.prototype, "clone", {
    enumerable: false
});
Array.prototype.contains = function (element) {
    return this.includes(element);
};
Object.defineProperty(Array.prototype, "contains", {
    enumerable: false
});
Array.prototype.equals = function (array) {
    if (!array || this.length !== array.length) {
        return false;
    }
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        }
        else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});
Array.prototype.remove = function (element) {
    for (;;) {
        const index = this.indexOf(element);
        if (index >= 0) {
            this.splice(index, 1);
        }
        else {
            return this;
        }
    }
};
Object.defineProperty(Array.prototype, "remove", {
    enumerable: false
});
Math.randomInt = function (max) {
    return Math.floor(max * Math.random());
};
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(Number(this), min), max);
};
Number.prototype.mod = function (n) {
    return ((Number(this) % n) + n) % n;
};
Number.prototype.padZero = function (length) {
    return String(this).padZero(length);
};
String.prototype.contains = function (string) {
    return this.includes(string);
};
String.prototype.format = function () {
    return this.replace(/%([0-9]+)/g, (s, n) => arguments[Number(n) - 1]);
};
String.prototype.padZero = function (length) {
    return this.padStart(length, "0");
};
