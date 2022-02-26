import { Rectangle, Graphics } from "../Core/index.js";
import { Window_Base,Window_Message } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_NameBox
 * 
 * The window for displaying a speaker name above the message window.
*/
export class Window_NameBox extends Window_Base {
    _name: string;
    _messageWindow: Window_Message;
    constructor() {
        const rect = new Rectangle();
        super(rect);
        this.initialize(rect);
    }

    public initialize(rect:Rectangle=new Rectangle()) {
        Window_Base.prototype.initialize.call(this, rect);
        this.openness = 0;
        this._name = "";
    };

    public setMessageWindow(messageWindow) {
        this._messageWindow = messageWindow;
    };

    public setName(name) {
        if (this._name !== name) {
            this._name = name;
            this.refresh();
        }
    };

    public clear() {
        this.setName("");
    };

    public start() {
        this.updatePlacement();
        this.updateBackground();
        this.createContents();
        this.refresh();
    };

    public updatePlacement() {
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        const messageWindow = this._messageWindow;
        if (window.$gameMessage.isRTL()) {
            this.x = messageWindow.x + messageWindow.width - this.width;
        } else {
            this.x = messageWindow.x;
        }
        if (messageWindow.y > 0) {
            this.y = messageWindow.y - this.height;
        } else {
            this.y = messageWindow.y + messageWindow.height;
        }
    };

    public updateBackground() {
        this.setBackgroundType(window.$gameMessage.background());
    };

    public windowWidth() {
        if (this._name) {
            const textWidth = this.textSizeEx(this._name).width;
            const padding = this.padding + this.itemPadding();
            const width = Math.ceil(textWidth) + padding * 2;
            return Math.min(width, Graphics.boxWidth);
        } else {
            return 0;
        }
    };

    public windowHeight() {
        return this.fittingHeight(1);
    };

    public refresh() {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._name, rect.x, rect.y, rect.width);
    };


}
