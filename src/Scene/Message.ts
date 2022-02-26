import { Graphics, Rectangle } from "../Core/index.js";
import { Window_Message, Window_ScrollText, Window_Gold, Window_NameBox, Window_ChoiceList, Window_NumberInput, Window_EventItem } from "../Window/index.js";
import { Scene_Base } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Scene_Message
 * 
 * The superclass of Scene_Map and Scene_Battle.
*/
export class Scene_Message extends Scene_Base {
    _messageWindow: Nullable<Window_Message>;
    _scrollTextWindow: Nullable<Window_ScrollText>;
    _goldWindow: Nullable<Window_Gold>;
    _nameBoxWindow: Nullable<Window_NameBox>;
    _choiceListWindow: Nullable<Window_ChoiceList>;
    _numberInputWindow: Nullable<Window_NumberInput>;
    _eventItemWindow: Nullable<Window_EventItem>;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Scene_Base.prototype.initialize.call(this);
    };

    public isMessageWindowClosing() {
        return this._messageWindow.isClosing();
    };

    public createAllWindows() {
        this.createMessageWindow();
        this.createScrollTextWindow();
        this.createGoldWindow();
        this.createNameBoxWindow();
        this.createChoiceListWindow();
        this.createNumberInputWindow();
        this.createEventItemWindow();
        this.associateWindows();
    };

    public createMessageWindow() {
        const rect = this.messageWindowRect();
        this._messageWindow = new Window_Message(rect);
        this.addWindow(this._messageWindow);
    };

    public messageWindowRect() {
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(4, false) + 8;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createScrollTextWindow() {
        const rect = this.scrollTextWindowRect();
        this._scrollTextWindow = new Window_ScrollText(rect);
        this.addWindow(this._scrollTextWindow);
    };

    public scrollTextWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this._goldWindow.openness = 0;
        this.addWindow(this._goldWindow);
    };

    public goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    public createNameBoxWindow() {
        this._nameBoxWindow = new Window_NameBox();
        this.addWindow(this._nameBoxWindow);
    };

    public createChoiceListWindow() {
        this._choiceListWindow = new Window_ChoiceList();
        this.addWindow(this._choiceListWindow);
    };

    public createNumberInputWindow() {
        this._numberInputWindow = new Window_NumberInput();
        this.addWindow(this._numberInputWindow);
    };

    public createEventItemWindow() {
        const rect = this.eventItemWindowRect();
        this._eventItemWindow = new Window_EventItem(rect);
        this.addWindow(this._eventItemWindow);
    };

    public eventItemWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(4, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    public associateWindows() {
        const messageWindow = this._messageWindow;
        messageWindow.setGoldWindow(this._goldWindow);
        messageWindow.setNameBoxWindow(this._nameBoxWindow);
        messageWindow.setChoiceListWindow(this._choiceListWindow);
        messageWindow.setNumberInputWindow(this._numberInputWindow);
        messageWindow.setEventItemWindow(this._eventItemWindow);
        this._nameBoxWindow.setMessageWindow(messageWindow);
        this._choiceListWindow.setMessageWindow(messageWindow);
        this._numberInputWindow.setMessageWindow(messageWindow);
        this._eventItemWindow.setMessageWindow(messageWindow);
    };
}
