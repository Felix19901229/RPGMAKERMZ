//-----------------------------------------------------------------------------
/**
 * The rectangle class.
 *
 * @class
 * @extends PIXI.Rectangle
 * @param {number} x - The x coordinate for the upper-left corner.
 * @param {number} y - The y coordinate for the upper-left corner.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 */
export class Rectangle extends PIXI.Rectangle {
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height);
        this.initialize(x, y, width, height);
    }
    public initialize(x?: number, y?: number, width?: number, height?: number) {
        PIXI.Rectangle.call(this, x, y, width, height);
    };
}