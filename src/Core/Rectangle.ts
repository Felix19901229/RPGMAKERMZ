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
    constructor(...args: [number?, number?, number?, number?]) {
        super(...args);
        this.initialize(...args);
    }
    public initialize(x: number, y: number, width: number, height: number) {
        PIXI.Rectangle.call(this, x, y, width, height);
    }
}
