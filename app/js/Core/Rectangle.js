export class Rectangle extends PIXI.Rectangle {
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(x, y, width, height) {
        PIXI.Rectangle.call(this, x, y, width, height);
    }
}
