import { ImageManager } from "../Manager/index.js";
import { Sprite_Clickable } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Sprite_Picture
 * 
 * The sprite for displaying a picture.
*/
export class Sprite_Picture extends Sprite_Clickable {
    _pictureId: number;
    _pictureName: string;
    constructor(...args: [number]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(pictureId) {
        Sprite_Clickable.prototype.initialize.call(this);
        this._pictureId = pictureId;
        this._pictureName = "";
        this.update();
    };

    public picture() {
        return $gameScreen.picture(this._pictureId);
    };

    public update() {
        Sprite_Clickable.prototype.update.call(this);
        this.updateBitmap();
        if (this.visible) {
            this.updateOrigin();
            this.updatePosition();
            this.updateScale();
            this.updateTone();
            this.updateOther();
        }
    };

    public updateBitmap() {
        const picture = this.picture();
        if (picture) {
            const pictureName = picture.name();
            if (this._pictureName !== pictureName) {
                this._pictureName = pictureName;
                this.loadBitmap();
            }
            this.visible = true;
        } else {
            this._pictureName = "";
            this.bitmap = null;
            this.visible = false;
        }
    };

    public updateOrigin() {
        const picture = this.picture();
        if (picture.origin() === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        } else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    };

    public updatePosition() {
        const picture = this.picture();
        this.x = Math.round(picture.x());
        this.y = Math.round(picture.y());
    };

    public updateScale() {
        const picture = this.picture();
        this.scale.x = picture.scaleX() / 100;
        this.scale.y = picture.scaleY() / 100;
    };

    public updateTone() {
        const picture = this.picture();
        if (picture.tone()) {
            this.setColorTone(picture.tone());
        } else {
            this.setColorTone([0, 0, 0, 0]);
        }
    };

    public updateOther() {
        const picture = this.picture();
        this.opacity = picture.opacity();
        this.blendMode = picture.blendMode();
        this.rotation = (picture.angle() * Math.PI) / 180;
    };

    public loadBitmap() {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
    };
}

