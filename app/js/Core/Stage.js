export class Stage extends PIXI.Container {
    constructor(...args) {
        super();
        this.initialize(...args);
    }
    initialize(...args) {
        PIXI.Container.call(this);
    }
    destroy() {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
    }
}
