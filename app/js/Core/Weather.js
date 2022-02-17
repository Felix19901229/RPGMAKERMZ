import { Bitmap, Graphics, Point, ScreenSprite, Sprite } from "./index.js";
export class Weather extends PIXI.Container {
    _width;
    _height;
    type;
    origin;
    power;
    _rainBitmap;
    _stormBitmap;
    _snowBitmap;
    _dimmerSprite;
    _sprites;
    viewport;
    constructor(...args) {
        super();
        this.initialize(...args);
    }
    initialize(...args) {
        PIXI.Container.call(this);
        this._width = Graphics.width;
        this._height = Graphics.height;
        this._sprites = [];
        this._createBitmaps();
        this._createDimmer();
        this.type = "none";
        this.power = 0;
        this.origin = new Point();
    }
    destroy() {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
        this._rainBitmap.destroy();
        this._stormBitmap.destroy();
        this._snowBitmap.destroy();
    }
    update() {
        this._updateDimmer();
        this._updateAllSprites();
    }
    _createBitmaps() {
        this._rainBitmap = new Bitmap(1, 60);
        this._rainBitmap.fillAll("white");
        this._stormBitmap = new Bitmap(2, 100);
        this._stormBitmap.fillAll("white");
        this._snowBitmap = new Bitmap(9, 9);
        this._snowBitmap.drawCircle(4, 4, 4, "white");
    }
    _createDimmer() {
        this._dimmerSprite = new ScreenSprite();
        this._dimmerSprite.setColor(80, 80, 80);
        this.addChild(this._dimmerSprite);
    }
    _updateDimmer() {
        this._dimmerSprite.opacity = Math.floor(this.power * 6);
    }
    _updateAllSprites() {
        const maxSprites = Math.floor(this.power * 10);
        while (this._sprites.length < maxSprites) {
            this._addSprite();
        }
        while (this._sprites.length > maxSprites) {
            this._removeSprite();
        }
        for (const sprite of this._sprites) {
            this._updateSprite(sprite);
            sprite.x = sprite.ax - this.origin.x;
            sprite.y = sprite.ay - this.origin.y;
        }
    }
    _addSprite() {
        const sprite = new Sprite(this.viewport);
        sprite.opacity = 0;
        this._sprites.push(sprite);
        this.addChild(sprite);
    }
    _removeSprite() {
        this.removeChild(this._sprites.pop());
    }
    _updateSprite(sprite) {
        switch (this.type) {
            case "rain":
                this._updateRainSprite(sprite);
                break;
            case "storm":
                this._updateStormSprite(sprite);
                break;
            case "snow":
                this._updateSnowSprite(sprite);
                break;
        }
        if (sprite.opacity < 40) {
            this._rebornSprite(sprite);
        }
    }
    _updateRainSprite(sprite) {
        sprite.bitmap = this._rainBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 6 * Math.sin(sprite.rotation);
        sprite.ay += 6 * Math.cos(sprite.rotation);
        sprite.opacity -= 6;
    }
    _updateStormSprite(sprite) {
        sprite.bitmap = this._stormBitmap;
        sprite.rotation = Math.PI / 8;
        sprite.ax -= 8 * Math.sin(sprite.rotation);
        sprite.ay += 8 * Math.cos(sprite.rotation);
        sprite.opacity -= 8;
    }
    _updateSnowSprite(sprite) {
        sprite.bitmap = this._snowBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 3 * Math.sin(sprite.rotation);
        sprite.ay += 3 * Math.cos(sprite.rotation);
        sprite.opacity -= 3;
    }
    _rebornSprite(sprite) {
        sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;
        sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
        sprite.opacity = 160 + Math.randomInt(60);
    }
}
