import { Graphics } from "../Core/index.js";
import { ConfigManager, DataManager } from "../Manager/index.js";
import { Sprite_Button } from "../Spriteset/index.js";
import { Window_ItemList, Window_Selectable } from "./index.js";
export class Window_EventItem extends Window_ItemList {
    _messageWindow;
    _cancelButton;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        Window_ItemList.prototype.initialize.call(this, rect);
        this.createCancelButton();
        this.openness = 0;
        this.deactivate();
        this.setHandler("ok", this.onOk.bind(this));
        this.setHandler("cancel", this.onCancel.bind(this));
    }
    ;
    setMessageWindow(messageWindow) {
        this._messageWindow = messageWindow;
    }
    ;
    createCancelButton() {
        if (ConfigManager.touchUI) {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.visible = false;
            this.addChild(this._cancelButton);
        }
    }
    ;
    start() {
        this.refresh();
        this.updatePlacement();
        this.placeCancelButton();
        this.forceSelect(0);
        this.open();
        this.activate();
    }
    ;
    update() {
        Window_Selectable.prototype.update.call(this);
        this.updateCancelButton();
    }
    ;
    updateCancelButton() {
        if (this._cancelButton) {
            this._cancelButton.visible = this.isOpen();
        }
    }
    ;
    updatePlacement() {
        if (this._messageWindow.y >= Graphics.boxHeight / 2) {
            this.y = 0;
        }
        else {
            this.y = Graphics.boxHeight - this.height;
        }
    }
    ;
    placeCancelButton() {
        if (this._cancelButton) {
            const spacing = 8;
            const button = this._cancelButton;
            if (this.y === 0) {
                button.y = this.height + spacing;
            }
            else if (this._messageWindow.y >= Graphics.boxHeight / 4) {
                const distance = this.y - this._messageWindow.y;
                button.y = -button.height - spacing - distance;
            }
            else {
                button.y = -button.height - spacing;
            }
            button.x = this.width - button.width - spacing;
        }
    }
    ;
    includes(item) {
        const itypeId = window.$gameMessage.itemChoiceItypeId();
        return DataManager.isItem(item) && item.itypeId === itypeId;
    }
    ;
    needsNumber() {
        const itypeId = window.$gameMessage.itemChoiceItypeId();
        if (itypeId === 2) {
            return window.$dataSystem.optKeyItemsNumber;
        }
        else if (itypeId >= 3) {
            return false;
        }
        else {
            return true;
        }
    }
    ;
    isEnabled() {
        return true;
    }
    ;
    onOk() {
        const item = this.item();
        const itemId = item ? item.id : 0;
        window.$gameVariables.setValue(window.$gameMessage.itemChoiceVariableId(), itemId);
        this._messageWindow.terminateMessage();
        this.close();
    }
    ;
    onCancel() {
        window.$gameVariables.setValue(window.$gameMessage.itemChoiceVariableId(), 0);
        this._messageWindow.terminateMessage();
        this.close();
    }
    ;
}
