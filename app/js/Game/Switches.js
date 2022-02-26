export class Game_Switches {
    _data;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(...args) {
        this.clear();
    }
    clear() {
        this._data = [];
    }
    value(switchId) {
        return !!this._data[switchId];
    }
    setValue(switchId, value) {
        if (switchId > 0 && switchId < window.$dataSystem.switches.length) {
            this._data[switchId] = value;
            this.onChange();
        }
    }
    onChange() {
        window.$gameMap.requestRefresh();
    }
}
