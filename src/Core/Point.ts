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
    constructor(x?:number, y?:number) {
        super(x,y);
        this.initialize(x,y);
    }

    public initialize(x?:number, y?:number) {
        PIXI.Point.call(this, x, y);
    };
}

