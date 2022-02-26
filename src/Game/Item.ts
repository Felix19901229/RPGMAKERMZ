import { DataManager } from "../Manager/index.js";

//-----------------------------------------------------------------------------
/**
 * Game_Item
 * 
 * The game object class for handling skills, items, weapons, and armor. It is
 * required because save data should not include the database object itself.
*/
export class Game_Item {
    _dataClass: "weapon" | "armor" | "item" | "skill" | "";
    _itemId: number;
    constructor(...args: [null?]) {
        this.initialize(...args);
    }

    public initialize(item?) {
        this._dataClass = "";
        this._itemId = 0;
        if (item) {
            this.setObject(item);
        }
    }

    public isSkill() {
        return this._dataClass === "skill";
    }

    public isItem() {
        return this._dataClass === "item";
    }

    public isUsableItem() {
        return this.isSkill() || this.isItem();
    }

    public isWeapon() {
        return this._dataClass === "weapon";
    }

    public isArmor() {
        return this._dataClass === "armor";
    }

    public isEquipItem() {
        return this.isWeapon() || this.isArmor();
    }

    public isNull() {
        return this._dataClass === "";
    }

    public itemId() {
        return this._itemId;
    }

    public object() {
        if (this.isSkill()) {
            return window.$dataSkills[this._itemId];
        } else if (this.isItem()) {
            return window.$dataItems[this._itemId];
        } else if (this.isWeapon()) {
            return window.$dataWeapons[this._itemId];
        } else if (this.isArmor()) {
            return window.$dataArmors[this._itemId];
        } else {
            return null;
        }
    }

    public setObject(item) {
        if (DataManager.isSkill(item)) {
            this._dataClass = "skill";
        } else if (DataManager.isItem(item)) {
            this._dataClass = "item";
        } else if (DataManager.isWeapon(item)) {
            this._dataClass = "weapon";
        } else if (DataManager.isArmor(item)) {
            this._dataClass = "armor";
        } else {
            this._dataClass = "";
        }
        this._itemId = item ? item.id : 0;
    }

    public setEquip(isWeapon, itemId) {
        this._dataClass = isWeapon ? "weapon" : "armor";
        this._itemId = itemId;
    }

}
