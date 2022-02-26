//-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 *
 * @class
 * @extends PIXI.Container
 */
export class Stage extends PIXI.Container {
    constructor(...args: any[]) {
        super();
        this.initialize(...args);
    }

    public initialize(...args) {
        PIXI.Container.call(this);
    }

    /**
     * Destroys the stage.
     */
    public destroy() {
        const options = { children: true, texture: true }
        PIXI.Container.prototype.destroy.call(this, options);
    }

}
