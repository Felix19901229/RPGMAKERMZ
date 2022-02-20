import { ColorFilter, Graphics, Rectangle, ScreenSprite, Sprite } from "../Core/index.js";
import { Sprite_Animation, Sprite_AnimationMV, Sprite_Picture, Sprite_Timer } from "./index.js";
export class Spriteset_Base extends Sprite {
    _animationSprites;
    _baseSprite;
    _blackScreen;
    _baseColorFilter;
    _pictureContainer;
    _timerSprite;
    _overallColorFilter;
    _effectsContainer;
    constructor(...args) {
        super();
        this.initialize(...args);
    }
    initialize(...args) {
        Sprite.prototype.initialize.call(this);
        this.setFrame(0, 0, Graphics.width, Graphics.height);
        this.loadSystemImages();
        this.createLowerLayer();
        this.createUpperLayer();
        this._animationSprites = [];
    }
    ;
    destroy(options) {
        this.removeAllAnimations();
        Sprite.prototype.destroy.call(this, options);
    }
    ;
    loadSystemImages() {
    }
    ;
    createLowerLayer() {
        this.createBaseSprite();
        this.createBaseFilters();
    }
    ;
    createUpperLayer() {
        this.createPictures();
        this.createTimer();
        this.createOverallFilters();
    }
    ;
    update() {
        Sprite.prototype.update.call(this);
        this.updateBaseFilters();
        this.updateOverallFilters();
        this.updatePosition();
        this.updateAnimations();
    }
    ;
    createBaseSprite() {
        this._baseSprite = new Sprite();
        this._blackScreen = new ScreenSprite();
        this._blackScreen.opacity = 255;
        this.addChild(this._baseSprite);
        this._baseSprite.addChild(this._blackScreen);
    }
    ;
    createBaseFilters() {
        this._baseSprite.filters = [];
        this._baseColorFilter = new ColorFilter();
        this._baseSprite.filters.push(this._baseColorFilter);
    }
    ;
    createPictures() {
        const rect = this.pictureContainerRect();
        this._pictureContainer = new Sprite();
        this._pictureContainer.setFrame(rect.x, rect.y, rect.width, rect.height);
        for (let i = 1; i <= $gameScreen.maxPictures(); i++) {
            this._pictureContainer.addChild(new Sprite_Picture(i));
        }
        this.addChild(this._pictureContainer);
    }
    ;
    pictureContainerRect() {
        return new Rectangle(0, 0, Graphics.width, Graphics.height);
    }
    ;
    createTimer() {
        this._timerSprite = new Sprite_Timer();
        this.addChild(this._timerSprite);
    }
    ;
    createOverallFilters() {
        this.filters = [];
        this._overallColorFilter = new ColorFilter();
        this.filters.push(this._overallColorFilter);
    }
    ;
    updateBaseFilters() {
        const filter = this._baseColorFilter;
        filter.setColorTone($gameScreen.tone());
    }
    ;
    updateOverallFilters() {
        const filter = this._overallColorFilter;
        filter.setBlendColor($gameScreen.flashColor());
        filter.setBrightness($gameScreen.brightness());
    }
    ;
    updatePosition() {
        const screen = $gameScreen;
        const scale = screen.zoomScale();
        this.scale.x = scale;
        this.scale.y = scale;
        this.x = Math.round(-screen.zoomX() * (scale - 1));
        this.y = Math.round(-screen.zoomY() * (scale - 1));
        this.x += Math.round(screen.shake());
    }
    ;
    findTargetSprite(...args) {
        return null;
    }
    ;
    updateAnimations() {
        for (const sprite of this._animationSprites) {
            if (!sprite.isPlaying()) {
                this.removeAnimation(sprite);
            }
        }
        this.processAnimationRequests();
    }
    ;
    processAnimationRequests() {
        for (;;) {
            const request = $gameTemp.retrieveAnimation();
            if (request) {
                this.createAnimation(request);
            }
            else {
                break;
            }
        }
    }
    ;
    createAnimation(request) {
        const animation = $dataAnimations[request.animationId];
        const targets = request.targets;
        const mirror = request.mirror;
        let delay = this.animationBaseDelay();
        const nextDelay = this.animationNextDelay();
        if (this.isAnimationForEach(animation)) {
            for (const target of targets) {
                this.createAnimationSprite([target], animation, mirror, delay);
                delay += nextDelay;
            }
        }
        else {
            this.createAnimationSprite(targets, animation, mirror, delay);
        }
    }
    ;
    createAnimationSprite(targets, animation, mirror, delay) {
        const mv = this.isMVAnimation(animation);
        const sprite = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
        const targetSprites = this.makeTargetSprites(targets);
        const baseDelay = this.animationBaseDelay();
        const previous = delay > baseDelay ? this.lastAnimationSprite() : null;
        if (this.animationShouldMirror(targets[0])) {
            mirror = !mirror;
        }
        sprite.targetObjects = targets;
        sprite.setup(targetSprites, animation, mirror, delay, previous);
        this._effectsContainer.addChild(sprite);
        this._animationSprites.push(sprite);
    }
    ;
    isMVAnimation(animation) {
        return !!animation.frames;
    }
    ;
    makeTargetSprites(targets) {
        const targetSprites = [];
        for (const target of targets) {
            const targetSprite = this.findTargetSprite(target);
            if (targetSprite) {
                targetSprites.push(targetSprite);
            }
        }
        return targetSprites;
    }
    ;
    lastAnimationSprite() {
        return this._animationSprites[this._animationSprites.length - 1];
    }
    ;
    isAnimationForEach(animation) {
        const mv = this.isMVAnimation(animation);
        return mv ? animation.position !== 3 : animation.displayType === 0;
    }
    ;
    animationBaseDelay() {
        return 8;
    }
    ;
    animationNextDelay() {
        return 12;
    }
    ;
    animationShouldMirror(target) {
        return target && target.isActor && target.isActor();
    }
    ;
    removeAnimation(sprite) {
        this._animationSprites.remove(sprite);
        this._effectsContainer.removeChild(sprite);
        for (const target of sprite.targetObjects) {
            if (target.endAnimation) {
                target.endAnimation();
            }
        }
        sprite.destroy();
    }
    ;
    removeAllAnimations() {
        for (const sprite of this._animationSprites) {
            this.removeAnimation(sprite);
        }
    }
    ;
    isAnimationPlaying() {
        return this._animationSprites.length > 0;
    }
    ;
}
