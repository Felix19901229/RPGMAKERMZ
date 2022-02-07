
//-----------------------------------------------------------------------------
/**
 * Game_Screen
 * 
 * The game object class for screen effect data, such as changes in color tone
 * and flashes.
*/
export class Game_Screen {
    _brightness: number;
    _tone: number[];
    _flashColor: number[];
    _shake: number;
    _zoomX: number;
    _zoomY: number;
    _zoomScale: number;
    _weatherPower: number;
    _weatherType: "none";
    _pictures: null[];
    _fadeOutDuration: number;
    _fadeInDuration: number;
    _toneTarget: number[];
    _toneDuration: number;
    _flashDuration: number;
    _shakePower: number;
    _shakeSpeed: number;
    _shakeDuration: number;
    _shakeDirection: number;
    _zoomScaleTarget: number;
    _zoomDuration: number;
    _weatherPowerTarget: number;
    _weatherDuration: number;
    constructor() {
        this.initialize();
    }

    public initialize() {
        this.clear();
    };

    public clear() {
        this.clearFade();
        this.clearTone();
        this.clearFlash();
        this.clearShake();
        this.clearZoom();
        this.clearWeather();
        this.clearPictures();
    };

    public onBattleStart() {
        this.clearFade();
        this.clearFlash();
        this.clearShake();
        this.clearZoom();
        this.eraseBattlePictures();
    };

    public brightness() {
        return this._brightness;
    };

    public tone() {
        return this._tone;
    };

    public flashColor() {
        return this._flashColor;
    };

    public shake() {
        return this._shake;
    };

    public zoomX() {
        return this._zoomX;
    };

    public zoomY() {
        return this._zoomY;
    };

    public zoomScale() {
        return this._zoomScale;
    };

    public weatherType() {
        return this._weatherType;
    };

    public weatherPower() {
        return this._weatherPower;
    };

    public picture(pictureId) {
        const realPictureId = this.realPictureId(pictureId);
        return this._pictures[realPictureId];
    };

    public realPictureId(pictureId) {
        if ($gameParty.inBattle()) {
            return pictureId + this.maxPictures();
        } else {
            return pictureId;
        }
    };

    public clearFade() {
        this._brightness = 255;
        this._fadeOutDuration = 0;
        this._fadeInDuration = 0;
    };

    public clearTone() {
        this._tone = [0, 0, 0, 0];
        this._toneTarget = [0, 0, 0, 0];
        this._toneDuration = 0;
    };

    public clearFlash() {
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
    };

    public clearShake() {
        this._shakePower = 0;
        this._shakeSpeed = 0;
        this._shakeDuration = 0;
        this._shakeDirection = 1;
        this._shake = 0;
    };

    public clearZoom() {
        this._zoomX = 0;
        this._zoomY = 0;
        this._zoomScale = 1;
        this._zoomScaleTarget = 1;
        this._zoomDuration = 0;
    };

    public clearWeather() {
        this._weatherType = "none";
        this._weatherPower = 0;
        this._weatherPowerTarget = 0;
        this._weatherDuration = 0;
    };

    public clearPictures() {
        this._pictures = [];
    };

    public eraseBattlePictures() {
        this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
    };

    public maxPictures() {
        return 100;
    };

    public startFadeOut(duration) {
        this._fadeOutDuration = duration;
        this._fadeInDuration = 0;
    };

    public startFadeIn(duration) {
        this._fadeInDuration = duration;
        this._fadeOutDuration = 0;
    };

    public startTint(tone, duration) {
        this._toneTarget = tone.clone();
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
        }
    };

    public startFlash(color, duration) {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    };

    public startShake(power, speed, duration) {
        this._shakePower = power;
        this._shakeSpeed = speed;
        this._shakeDuration = duration;
    };

    public startZoom(x, y, scale, duration) {
        this._zoomX = x;
        this._zoomY = y;
        this._zoomScaleTarget = scale;
        this._zoomDuration = duration;
    };

    public setZoom(x, y, scale) {
        this._zoomX = x;
        this._zoomY = y;
        this._zoomScale = scale;
    };

    public changeWeather(type, power, duration) {
        if (type !== "none" || duration === 0) {
            this._weatherType = type;
        }
        this._weatherPowerTarget = type === "none" ? 0 : power;
        this._weatherDuration = duration;
        if (duration === 0) {
            this._weatherPower = this._weatherPowerTarget;
        }
    };

    public update() {
        this.updateFadeOut();
        this.updateFadeIn();
        this.updateTone();
        this.updateFlash();
        this.updateShake();
        this.updateZoom();
        this.updateWeather();
        this.updatePictures();
    };

    public updateFadeOut() {
        if (this._fadeOutDuration > 0) {
            const d = this._fadeOutDuration;
            this._brightness = (this._brightness * (d - 1)) / d;
            this._fadeOutDuration--;
        }
    };

    public updateFadeIn() {
        if (this._fadeInDuration > 0) {
            const d = this._fadeInDuration;
            this._brightness = (this._brightness * (d - 1) + 255) / d;
            this._fadeInDuration--;
        }
    };

    public updateTone() {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
    };

    public updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration;
            this._flashColor[3] *= (d - 1) / d;
            this._flashDuration--;
        }
    };

    public updateShake() {
        if (this._shakeDuration > 0 || this._shake !== 0) {
            const delta =
                (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
            if (
                this._shakeDuration <= 1 &&
                this._shake * (this._shake + delta) < 0
            ) {
                this._shake = 0;
            } else {
                this._shake += delta;
            }
            if (this._shake > this._shakePower * 2) {
                this._shakeDirection = -1;
            }
            if (this._shake < -this._shakePower * 2) {
                this._shakeDirection = 1;
            }
            this._shakeDuration--;
        }
    };

    public updateZoom() {
        if (this._zoomDuration > 0) {
            const d = this._zoomDuration;
            const t = this._zoomScaleTarget;
            this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
            this._zoomDuration--;
        }
    };

    public updateWeather() {
        if (this._weatherDuration > 0) {
            const d = this._weatherDuration;
            const t = this._weatherPowerTarget;
            this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
            this._weatherDuration--;
            if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
                this._weatherType = "none";
            }
        }
    };

    public updatePictures() {
        for (const picture of this._pictures) {
            if (picture) {
                picture.update();
            }
        }
    };

    public startFlashForDamage() {
        this.startFlash([255, 0, 0, 128], 8);
    };

    // prettier-ignore
    public showPicture(
        pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode
    ) {
        const realPictureId = this.realPictureId(pictureId);
        const picture = new Game_Picture();
        picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
        this._pictures[realPictureId] = picture;
    };

    // prettier-ignore
    public movePicture(
        pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration,
        easingType
    ) {
        const picture = this.picture(pictureId);
        if (picture) {
            // prettier-ignore
            picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode,
                duration, easingType);
        }
    };

    public rotatePicture(pictureId, speed) {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.rotate(speed);
        }
    };

    public tintPicture(pictureId, tone, duration) {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.tint(tone, duration);
        }
    };

    public erasePicture(pictureId) {
        const realPictureId = this.realPictureId(pictureId);
        this._pictures[realPictureId] = null;
    };
}
