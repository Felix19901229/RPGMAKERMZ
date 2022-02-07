//-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 *
 * @class
 * @extends PIXI.Container
 */
export class Stage extends PIXI.Container {
    constructor() {
        super();
        this.initialize();
    }

    public initialize() {
        PIXI.Container.call(this);
    };

    /**
     * Destroys the stage.
     */
    public destroy() {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
    };

}
