//-----------------------------------------------------------------------------
/**
 * The point class.
 *
 * @class
 * @extends PIXI.Point
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 */
export class Point extends PIXI.Point {
    constructor(...args:[number?,number?]) {
        super(...args);
        this.initialize(...args);
    }
    public initialize(x?: number, y?: number) {
        PIXI.Point.call(this, x, y);
    }
}

