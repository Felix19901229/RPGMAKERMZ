
import { Rectangle } from "../Core/index.js";
import { Window_Base } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_Help
 * 
 * The window for displaying the description of the selected item.
*/
export class Window_Help extends Window_Base {
    _text: string;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);

    } 
    public initialize(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._text = "";
    };
    public setText(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    };
    public clear() {
        this.setText("");
    };
    public setItem(item) {
        this.setText(item ? item.description : "");
    };
    public refresh() {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    };
}
