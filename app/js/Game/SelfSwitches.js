export class Game_SelfSwitches {
    _data;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(...args) {
        this.clear();
    }
    clear() {
        this._data = {};
    }
    value(key) {
        return !!this._data[key];
    }
    setValue(key, value) {
        if (value) {
            this._data[key] = true;
        }
        else {
            delete this._data[key];
        }
        this.onChange();
    }
    onChange() {
        $gameMap.requestRefresh();
    }
}
