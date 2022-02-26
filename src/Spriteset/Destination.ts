import { Bitmap, Sprite } from "../Core/index.js";

//-----------------------------------------------------------------------------
/**
 * Sprite_Destination
 * 
 * The sprite for displaying the destination place of the touch input.
*/
export class Sprite_Destination extends Sprite {
    _frameCount: number;
    constructor(...args: any[]) {
        super();
        this.initialize(...args);
    }

    public initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this._frameCount = 0;
    };

    public destroy(options) {
        if (this.bitmap) {
            this.bitmap.destroy();
        }
        Sprite.prototype.destroy.call(this, options);
    };

    public update() {
        Sprite.prototype.update.call(this);
        if (window.$gameTemp.isDestinationValid()) {
            this.updatePosition();
            this.updateAnimation();
            this.visible = true;
        } else {
            this._frameCount = 0;
            this.visible = false;
        }
    };

    public createBitmap() {
        const tileWidth = window.$gameMap.tileWidth();
        const tileHeight = window.$gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        this.bitmap.fillAll("white");
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = 1;
    };

    public updatePosition() {
        const tileWidth = window.$gameMap.tileWidth();
        const tileHeight = window.$gameMap.tileHeight();
        const x = window.$gameTemp.destinationX();
        const y = window.$gameTemp.destinationY();
        this.x = (window.$gameMap.adjustX(x) + 0.5) * tileWidth;
        this.y = (window.$gameMap.adjustY(y) + 0.5) * tileHeight;
    };

    public updateAnimation() {
        this._frameCount++;
        this._frameCount %= 20;
        this.opacity = (20 - this._frameCount) * 6;
        this.scale.x = 1 + this._frameCount / 20;
        this.scale.y = this.scale.x;
    };

}
