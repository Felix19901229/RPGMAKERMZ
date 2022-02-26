
import { Rectangle } from "../Core/index.js";
import { ColorManager } from "../Manager/index.js";
import { Window_Base } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_MapName
 * 
 * The window for displaying the map name on the map screen.
*/
export class Window_MapName extends Window_Base {
    _showCount: number;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect: Rectangle) {
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0;
        this.contentsOpacity = 0;
        this._showCount = 0;
        this.refresh();
    };

    public update() {
        Window_Base.prototype.update.call(this);
        if (this._showCount > 0 && window.$gameMap.isNameDisplayEnabled()) {
            this.updateFadeIn();
            this._showCount--;
        } else {
            this.updateFadeOut();
        }
    };

    public updateFadeIn() {
        this.contentsOpacity += 16;
    };

    public updateFadeOut() {
        this.contentsOpacity -= 16;
    };

    public open() {
        this.refresh();
        this._showCount = 150;
    };

    public close() {
        this._showCount = 0;
    };

    public refresh() {
        this.contents.clear();
        if (window.$gameMap.displayName()) {
            const width = this.innerWidth;
            this.drawBackground(0, 0, width, this.lineHeight());
            this.drawText(window.$gameMap.displayName(), 0, 0, width, "center");
        }
    };

    public drawBackground(x, y, width, height) {
        const color1 = ColorManager.dimColor1();
        const color2 = ColorManager.dimColor2();
        const half = width / 2;
        this.contents.gradientFillRect(x, y, half, height, color2, color1);
        this.contents.gradientFillRect(x + half, y, half, height, color1, color2);
    };


}
