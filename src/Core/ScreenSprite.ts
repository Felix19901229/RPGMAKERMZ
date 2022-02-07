//-----------------------------------------------------------------------------
/**
 * The sprite which covers the entire game screen.
 *
 * @class
 * @extends PIXI.Container
 */
export class ScreenSprite extends PIXI.Container {
    public _graphics: PIXI.Graphics;
    public _red: number;
    public _green: number;
    public _blue: number;
    /**
     * The opacity of the sprite (0 to 255).
     *
     * @type number
     * @name ScreenSprite#opacity
     */
    public get opacity() {
        return this.alpha * 255;
    }
    public set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }
    constructor() {
        super();
        this.initialize();
    }

    public initialize() {
        PIXI.Container.call(this);
        this._graphics = new PIXI.Graphics();
        this.addChild(this._graphics);
        this.opacity = 0;
        this._red = -1;
        this._green = -1;
        this._blue = -1;
        this.setBlack();
    };


    /**
     * Destroys the screen sprite.
     */
    public destroy() {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
    };

    /**
     * Sets black to the color of the screen sprite.
     */
    public setBlack() {
        this.setColor(0, 0, 0);
    };

    /**
     * Sets white to the color of the screen sprite.
     */
    public setWhite() {
        this.setColor(255, 255, 255);
    };

    /**
     * Sets the color of the screen sprite by values.
     *
     * @param {number} r - The red value in the range (0, 255).
     * @param {number} g - The green value in the range (0, 255).
     * @param {number} b - The blue value in the range (0, 255).
     */
    public setColor(r:FF, g:FF, b:FF) {
        if (this._red !== r || this._green !== g || this._blue !== b) {
            r = Math.round(r || 0).clamp(0, 255) as FF;
            g = Math.round(g || 0).clamp(0, 255) as FF;
            b = Math.round(b || 0).clamp(0, 255) as FF;
            this._red = r;
            this._green = g;
            this._blue = b;
            const graphics = this._graphics;
            graphics.clear();
            graphics.beginFill((r << 16) | (g << 8) | b, 1);
            graphics.drawRect(-50000, -50000, 100000, 100000);
        }
    };
}
