export class Point extends PIXI.Point {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(x, y) {
        PIXI.Point.call(this, x, y);
    }
}
