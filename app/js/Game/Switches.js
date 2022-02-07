export class Game_Switches {
    _data;
    constructor() {
        this.initialize();
    }
    initialize() {
        this.clear();
    }
    ;
    clear() {
        this._data = [];
    }
    ;
    value(switchId) {
        return !!this._data[switchId];
    }
    ;
    setValue(switchId, value) {
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._data[switchId] = value;
            this.onChange();
        }
    }
    ;
    onChange = function () {
        $gameMap.requestRefresh();
    };
}
