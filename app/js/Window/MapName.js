import { ColorManager } from "../Manager/index.js";
import { Window_Base } from "./index.js";
export class Window_MapName extends Window_Base {
    _showCount;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0;
        this.contentsOpacity = 0;
        this._showCount = 0;
        this.refresh();
    }
    ;
    update() {
        Window_Base.prototype.update.call(this);
        if (this._showCount > 0 && window.$gameMap.isNameDisplayEnabled()) {
            this.updateFadeIn();
            this._showCount--;
        }
        else {
            this.updateFadeOut();
        }
    }
    ;
    updateFadeIn() {
        this.contentsOpacity += 16;
    }
    ;
    updateFadeOut() {
        this.contentsOpacity -= 16;
    }
    ;
    open() {
        this.refresh();
        this._showCount = 150;
    }
    ;
    close() {
        this._showCount = 0;
    }
    ;
    refresh() {
        this.contents.clear();
        if (window.$gameMap.displayName()) {
            const width = this.innerWidth;
            this.drawBackground(0, 0, width, this.lineHeight());
            this.drawText(window.$gameMap.displayName(), 0, 0, width, "center");
        }
    }
    ;
    drawBackground(x, y, width, height) {
        const color1 = ColorManager.dimColor1();
        const color2 = ColorManager.dimColor2();
        const half = width / 2;
        this.contents.gradientFillRect(x, y, half, height, color2, color1);
        this.contents.gradientFillRect(x + half, y, half, height, color1, color2);
    }
    ;
}
