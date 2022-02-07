//=============================================================================
// rmmz_core.js v1.0.0
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * This section contains some methods that will be added to the standard
 * Javascript objects.
 *
 * @namespace JsExtensions
 */

interface Array<T> {
    /**
     * Makes a shallow copy of the array.
     *
     * @memberof JsExtensions
     * @returns {array} A shallow copy of the array.
     */
    clone: () => Array<T>;
    /**
     * Checks whether the array contains a given element.
     *
     * @memberof JsExtensions
     * @param {any} element - The element to search for.
     * @returns {boolean} True if the array contains a given element.
     * @deprecated includes() should be used instead.
     */
    contains: (element: T) => boolean;

    /**
     * Checks whether the two arrays are the same.
     *
     * @memberof JsExtensions
     * @param {array} array - The array to compare to.
     * @returns {boolean} True if the two arrays are the same.
     */
    equals: (array: any[]) => boolean;

    /**
     * Removes a given element from the array (in place).
     *
     * @memberof JsExtensions
     * @param {any} element - The element to remove.
     * @returns {array} The array after remove.
     */
    remove: (element: T) => Array<T>;
}

interface Math {
    /**
     * Generates a random integer in the range (0, max-1).
     *
     * @memberof JsExtensions
     * @param {number} max - The upper boundary (excluded).
     * @returns {number} A random integer.
     */
    randomInt: (max: number) => number;
}

interface Number {
    /**
     * Returns a number whose value is limited to the given range.
     *
     * @memberof JsExtensions
     * @param {number} min - The lower boundary.
     * @param {number} max - The upper boundary.
     * @returns {number} A number in the range (min, max).
     */
    clamp: (min: number, max: number) => number;

    /**
     * Returns a modulo value which is always positive.
     *
     * @memberof JsExtensions
     * @param {number} n - The divisor.
     * @returns {number} A modulo value.
     */
    mod: (n: number) => number;

    /**
     * Makes a number string with leading zeros.
     *
     * @memberof JsExtensions
     * @param {number} length - The length of the output string.
     * @returns {string} A string with leading zeros.
     */
    padZero: (length: number) => string;
}

interface String {
    /**
     * Checks whether the string contains a given string.
     *
     * @memberof JsExtensions
     * @param {string} string - The string to search for.
     * @returns {boolean} True if the string contains a given string.
     * @deprecated includes() should be used instead.
     */
    contains: (string: string) => boolean;

    /**
     * Replaces %1, %2 and so on in the string to the arguments.
     *
     * @memberof JsExtensions
     * @param {any} ...args The objects to format.
     * @returns {string} A formatted string.
     */
    format: (...args) => string;

    /**
     * Makes a number string with leading zeros.
     *
     * @memberof JsExtensions
     * @param {number} length - The length of the output string.
     * @returns {string} A string with leading zeros.
     */
    padZero: (length: number) => string;
}