import { Point, Rectangle, Sprite, TilingSprite } from "./index.js";
export class Window extends PIXI.Container {
    _isWindow;
    _windowskin;
    _width;
    _height;
    _cursorRect;
    _openness;
    _animationCount;
    _padding;
    _margin;
    _colorTone;
    origin;
    active;
    frameVisible;
    cursorVisible;
    downArrowVisible;
    upArrowVisible;
    pause;
    _clientArea;
    _contentsBackSprite;
    _cursorSprite;
    _contentsSprite;
    _downArrowSprite;
    _upArrowSprite;
    _pauseSignSprite;
    _frameSprite;
    _backSprite;
    _container;
    _innerChildren = [];
    children = [];
    get windowskin() {
        return this._windowskin;
    }
    set windowskin(value) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    }
    get contents() {
        return this._contentsSprite.bitmap;
    }
    set contents(value) {
        this._contentsSprite.bitmap = value;
    }
    get contentsBack() {
        return this._contentsBackSprite.bitmap;
    }
    set contentsBack(value) {
        this._contentsBackSprite.bitmap = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        this._refreshAllParts();
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        this._refreshAllParts();
    }
    get padding() {
        return this._padding;
    }
    set padding(value) {
        this._padding = value;
        this._refreshAllParts();
    }
    get margin() {
        return this._margin;
    }
    set margin(value) {
        this._margin = value;
        this._refreshAllParts();
    }
    get opacity() {
        return this._container.alpha * 255;
    }
    set opacity(value) {
        this._container.alpha = value.clamp(0, 255) / 255;
    }
    get backOpacity() {
        return this._backSprite.alpha * 255;
    }
    set backOpacity(value) {
        this._backSprite.alpha = value.clamp(0, 255) / 255;
    }
    get contentsOpacity() {
        return this._contentsSprite.alpha * 255;
    }
    set contentsOpacity(value) {
        this._contentsSprite.alpha = value.clamp(0, 255) / 255;
    }
    get openness() {
        return this._openness;
    }
    set openness(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
            this._container.scale.y = this._openness / 255;
            this._container.y = (this.height / 2) * (1 - this._openness / 255);
        }
    }
    get innerWidth() {
        return Math.max(0, this._width - this._padding * 2);
    }
    get innerHeight() {
        return Math.max(0, this._height - this._padding * 2);
    }
    get innerRect() {
        return new Rectangle(this._padding, this._padding, this.innerWidth, this.innerHeight);
    }
    constructor(...args) {
        super();
        delete this.width;
        delete this.height;
        this.initialize(...args);
    }
    initialize(...args) {
        PIXI.Container.call(this);
        this._isWindow = true;
        this._windowskin = null;
        this._width = 0;
        this._height = 0;
        this._cursorRect = new Rectangle();
        this._openness = 255;
        this._animationCount = 0;
        this._padding = 12;
        this._margin = 4;
        this._colorTone = [0, 0, 0, 0];
        this._innerChildren = [];
        this._container = null;
        this._backSprite = null;
        this._frameSprite = null;
        this._contentsBackSprite = null;
        this._cursorSprite = null;
        this._contentsSprite = null;
        this._downArrowSprite = null;
        this._upArrowSprite = null;
        this._pauseSignSprite = null;
        this._createAllParts();
        this.origin = new Point();
        this.active = true;
        this.frameVisible = true;
        this.cursorVisible = true;
        this.downArrowVisible = false;
        this.upArrowVisible = false;
        this.pause = false;
    }
    destroy(...args) {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
    }
    update() {
        if (this.active) {
            this._animationCount++;
        }
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }
    move(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        if (this._width !== width || this._height !== height) {
            this._width = width || 0;
            this._height = height || 0;
            this._refreshAllParts();
        }
    }
    isOpen() {
        return this._openness >= 255;
    }
    isClosed() {
        return this._openness <= 0;
    }
    setCursorRect(x, y, width, height) {
        const cw = Math.floor(width || 0);
        const ch = Math.floor(height || 0);
        this._cursorRect.x = Math.floor(x || 0);
        this._cursorRect.y = Math.floor(y || 0);
        if (this._cursorRect.width !== cw || this._cursorRect.height !== ch) {
            this._cursorRect.width = cw;
            this._cursorRect.height = ch;
            this._refreshCursor();
        }
    }
    moveCursorBy(x, y) {
        this._cursorRect.x += x;
        this._cursorRect.y += y;
    }
    moveInnerChildrenBy(x, y) {
        for (const child of this._innerChildren) {
            child.x += x;
            child.y += y;
        }
    }
    setTone(r, g, b) {
        const tone = this._colorTone;
        if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
            this._colorTone = [r, g, b, 0];
            this._refreshBack();
        }
    }
    addChildToBack(child) {
        const containerIndex = this.children.indexOf(this._container);
        return this.addChildAt(child, containerIndex + 1);
    }
    addInnerChild(child) {
        this._innerChildren.push(child);
        return this._clientArea.addChild(child);
    }
    updateTransform() {
        this._updateClientArea();
        this._updateFrame();
        this._updateContentsBack();
        this._updateCursor();
        this._updateContents();
        this._updateArrows();
        this._updatePauseSign();
        PIXI.Container.prototype.updateTransform.call(this);
        this._updateFilterArea();
    }
    drawShape(graphics) {
        if (graphics) {
            const width = this.width;
            const height = (this.height * this._openness) / 255;
            const x = this.x;
            const y = this.y + (this.height - height) / 2;
            graphics.beginFill(0xffffff);
            graphics.drawRoundedRect(x, y, width, height, 0);
            graphics.endFill();
        }
    }
    _createAllParts() {
        this._createContainer();
        this._createBackSprite();
        this._createFrameSprite();
        this._createClientArea();
        this._createContentsBackSprite();
        this._createCursorSprite();
        this._createContentsSprite();
        this._createArrowSprites();
        this._createPauseSignSprites();
    }
    _createContainer() {
        this._container = new PIXI.Container();
        this.addChild(this._container);
    }
    _createBackSprite() {
        this._backSprite = new Sprite();
        this._backSprite.addChild(new TilingSprite());
        this._container.addChild(this._backSprite);
    }
    _createFrameSprite() {
        this._frameSprite = new Sprite();
        for (let i = 0; i < 8; i++) {
            this._frameSprite.addChild(new Sprite());
        }
        this._container.addChild(this._frameSprite);
    }
    _createClientArea() {
        this._clientArea = new Sprite();
        this._clientArea.filters = [new PIXI.filters.AlphaFilter()];
        this._clientArea.filterArea = new Rectangle();
        this._clientArea.move(this._padding, this._padding);
        this.addChild(this._clientArea);
    }
    _createContentsBackSprite() {
        this._contentsBackSprite = new Sprite();
        this._clientArea.addChild(this._contentsBackSprite);
    }
    _createCursorSprite() {
        this._cursorSprite = new Sprite();
        for (let i = 0; i < 9; i++) {
            this._cursorSprite.addChild(new Sprite());
        }
        this._clientArea.addChild(this._cursorSprite);
    }
    _createContentsSprite() {
        this._contentsSprite = new Sprite();
        this._clientArea.addChild(this._contentsSprite);
    }
    _createArrowSprites() {
        this._downArrowSprite = new Sprite();
        this.addChild(this._downArrowSprite);
        this._upArrowSprite = new Sprite();
        this.addChild(this._upArrowSprite);
    }
    _createPauseSignSprites() {
        this._pauseSignSprite = new Sprite();
        this.addChild(this._pauseSignSprite);
    }
    _onWindowskinLoad() {
        this._refreshAllParts();
    }
    _refreshAllParts() {
        this._refreshBack();
        this._refreshFrame();
        this._refreshCursor();
        this._refreshArrows();
        this._refreshPauseSign();
    }
    _refreshBack() {
        const m = this._margin;
        const w = Math.max(0, this._width - m * 2);
        const h = Math.max(0, this._height - m * 2);
        const sprite = this._backSprite;
        const tilingSprite = sprite.children[0];
        sprite.bitmap = this._windowskin;
        sprite.setFrame(0, 0, 95, 95);
        sprite.move(m, m);
        sprite.scale.x = w / 95;
        sprite.scale.y = h / 95;
        tilingSprite.bitmap = this._windowskin;
        tilingSprite.setFrame(0, 96, 96, 96);
        tilingSprite.move(0, 0, w, h);
        tilingSprite.scale.x = 1 / sprite.scale.x;
        tilingSprite.scale.y = 1 / sprite.scale.y;
        sprite.setColorTone(this._colorTone);
    }
    _refreshFrame() {
        const drect = { x: 0, y: 0, width: this._width, height: this._height };
        const srect = { x: 96, y: 0, width: 96, height: 96 };
        const m = 24;
        for (const child of this._frameSprite.children) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this._frameSprite, srect, drect, m);
    }
    _refreshCursor() {
        const drect = this._cursorRect.clone();
        const srect = { x: 96, y: 96, width: 48, height: 48 };
        const m = 4;
        for (const child of this._cursorSprite.children) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this._cursorSprite, srect, drect, m);
    }
    _setRectPartsGeometry(sprite, srect, drect, m) {
        const sx = srect.x;
        const sy = srect.y;
        const sw = srect.width;
        const sh = srect.height;
        const dx = drect.x;
        const dy = drect.y;
        const dw = drect.width;
        const dh = drect.height;
        const smw = sw - m * 2;
        const smh = sh - m * 2;
        const dmw = dw - m * 2;
        const dmh = dh - m * 2;
        const children = sprite.children;
        sprite.setFrame(0, 0, dw, dh);
        sprite.move(dx, dy);
        children[0].setFrame(sx, sy, m, m);
        children[1].setFrame(sx + sw - m, sy, m, m);
        children[2].setFrame(sx, sy + sw - m, m, m);
        children[3].setFrame(sx + sw - m, sy + sw - m, m, m);
        children[0].move(0, 0);
        children[1].move(dw - m, 0);
        children[2].move(0, dh - m);
        children[3].move(dw - m, dh - m);
        children[4].move(m, 0);
        children[5].move(m, dh - m);
        children[6].move(0, m);
        children[7].move(dw - m, m);
        children[4].setFrame(sx + m, sy, smw, m);
        children[5].setFrame(sx + m, sy + sw - m, smw, m);
        children[6].setFrame(sx, sy + m, m, smh);
        children[7].setFrame(sx + sw - m, sy + m, m, smh);
        children[4].scale.x = dmw / smw;
        children[5].scale.x = dmw / smw;
        children[6].scale.y = dmh / smh;
        children[7].scale.y = dmh / smh;
        if (children[8]) {
            children[8].setFrame(sx + m, sy + m, smw, smh);
            children[8].move(m, m);
            children[8].scale.x = dmw / smw;
            children[8].scale.y = dmh / smh;
        }
        for (const child of children) {
            child.visible = dw > 0 && dh > 0;
        }
    }
    _refreshArrows() {
        const w = this._width;
        const h = this._height;
        const p = 24;
        const q = p / 2;
        const sx = 96 + p;
        const sy = 0 + p;
        this._downArrowSprite.bitmap = this._windowskin;
        this._downArrowSprite.anchor.x = 0.5;
        this._downArrowSprite.anchor.y = 0.5;
        this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
        this._downArrowSprite.move(w / 2, h - q);
        this._upArrowSprite.bitmap = this._windowskin;
        this._upArrowSprite.anchor.x = 0.5;
        this._upArrowSprite.anchor.y = 0.5;
        this._upArrowSprite.setFrame(sx + q, sy, p, q);
        this._upArrowSprite.move(w / 2, q);
    }
    _refreshPauseSign() {
        const sx = 144;
        const sy = 96;
        const p = 24;
        this._pauseSignSprite.bitmap = this._windowskin;
        this._pauseSignSprite.anchor.x = 0.5;
        this._pauseSignSprite.anchor.y = 1;
        this._pauseSignSprite.move(this._width / 2, this._height);
        this._pauseSignSprite.setFrame(sx, sy, p, p);
        this._pauseSignSprite.alpha = 0;
    }
    _updateClientArea() {
        const pad = this._padding;
        this._clientArea.move(pad, pad);
        this._clientArea.x = pad - this.origin.x;
        this._clientArea.y = pad - this.origin.y;
        if (this.innerWidth > 0 && this.innerHeight > 0) {
            this._clientArea.visible = this.isOpen();
        }
        else {
            this._clientArea.visible = false;
        }
    }
    _updateFrame() {
        this._frameSprite.visible = this.frameVisible;
    }
    _updateContentsBack() {
        const bitmap = this._contentsBackSprite.bitmap;
        if (bitmap) {
            this._contentsBackSprite.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    }
    _updateCursor() {
        this._cursorSprite.alpha = this._makeCursorAlpha();
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y;
    }
    _makeCursorAlpha() {
        const blinkCount = this._animationCount % 40;
        const baseAlpha = this.contentsOpacity / 255;
        if (this.active) {
            if (blinkCount < 20) {
                return baseAlpha - blinkCount / 32;
            }
            else {
                return baseAlpha - (40 - blinkCount) / 32;
            }
        }
        return baseAlpha;
    }
    _updateContents() {
        const bitmap = this._contentsSprite.bitmap;
        if (bitmap) {
            this._contentsSprite.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    }
    _updateArrows() {
        this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
        this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
    }
    _updatePauseSign() {
        const sprite = this._pauseSignSprite;
        const x = Math.floor(this._animationCount / 16) % 2;
        const y = Math.floor(this._animationCount / 16 / 2) % 2;
        const sx = 144;
        const sy = 96;
        const p = 24;
        if (!this.pause) {
            sprite.alpha = 0;
        }
        else if (sprite.alpha < 1) {
            sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
        }
        sprite.setFrame(sx + x * p, sy + y * p, p, p);
        sprite.visible = this.isOpen();
    }
    _updateFilterArea() {
        const pos = this._clientArea.worldTransform.apply(new Point(0, 0));
        const filterArea = this._clientArea.filterArea;
        filterArea.x = pos.x + this.origin.x;
        filterArea.y = pos.y + this.origin.y;
        filterArea.width = this.innerWidth;
        filterArea.height = this.innerHeight;
    }
}
