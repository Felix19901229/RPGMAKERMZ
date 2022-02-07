export class Rectangle extends PIXI.Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.initialize(x, y, width, height);
    }
    initialize(x, y, width, height) {
        PIXI.Rectangle.call(this, x, y, width, height);
    }
    ;
}
