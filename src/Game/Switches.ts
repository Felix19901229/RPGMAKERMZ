//-----------------------------------------------------------------------------
/**
 * Game_Switches
 * 
 * The game object class for switches.
*/
export class Game_Switches {
    _data: null[];
    constructor() {
        this.initialize();
    }
    public initialize() {
        this.clear();
    };

    public clear() {
        this._data = [];
    };

    public value(switchId) {
        return !!this._data[switchId];
    };

    public setValue(switchId, value) {
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._data[switchId] = value;
            this.onChange();
        }
    };

    public onChange = function () {
        $gameMap.requestRefresh();
    };
}

