export class ScreenSprite extends PIXI.Container {
    _graphics;
    _red;
    _green;
    _blue;
    get opacity() {
        return this.alpha * 255;
    }
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }
    constructor() {
        super();
        this.initialize();
    }
    initialize() {
        PIXI.Container.call(this);
        this._graphics = new PIXI.Graphics();
        this.addChild(this._graphics);
        this.opacity = 0;
        this._red = -1;
        this._green = -1;
        this._blue = -1;
        this.setBlack();
    }
    ;
    destroy() {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
    }
    ;
    setBlack() {
        this.setColor(0, 0, 0);
    }
    ;
    setWhite() {
        this.setColor(255, 255, 255);
    }
    ;
    setColor(r, g, b) {
        if (this._red !== r || this._green !== g || this._blue !== b) {
            r = Math.round(r || 0).clamp(0, 255);
            g = Math.round(g || 0).clamp(0, 255);
            b = Math.round(b || 0).clamp(0, 255);
            this._red = r;
            this._green = g;
            this._blue = b;
            const graphics = this._graphics;
            graphics.clear();
            graphics.beginFill((r << 16) | (g << 8) | b, 1);
            graphics.drawRect(-50000, -50000, 100000, 100000);
        }
    }
    ;
}
