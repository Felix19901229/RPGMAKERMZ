import { Window_Base } from "./index.js";
export class Window_Help extends Window_Base {
    _text;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._text = "";
    }
    ;
    setText(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    }
    ;
    clear() {
        this.setText("");
    }
    ;
    setItem(item) {
        this.setText(item ? item.description : "");
    }
    ;
    refresh() {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    }
    ;
}
