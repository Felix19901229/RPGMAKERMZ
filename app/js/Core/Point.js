export class Point extends PIXI.Point {
    constructor(x, y) {
        super(x, y);
        this.initialize(x, y);
    }
    initialize(x, y) {
        PIXI.Point.call(this, x, y);
    }
    ;
}
