export class Stage extends PIXI.Container {
    constructor() {
        super();
        this.initialize();
    }
    initialize() {
        PIXI.Container.call(this);
    }
    ;
    destroy() {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
    }
    ;
}
