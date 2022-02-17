//-----------------------------------------------------------------------------
/**
 * Game_Variables
 * 
 * The game object class for variables.
*/
export class Game_Variables {
    _data: null[];
    constructor(...args: any[]) {
        this.initialize(...args);
    }

    public initialize(...args) {
        this.clear();
    }

    public clear() {
        this._data = [];
    }

    public value(variableId) {
        return this._data[variableId] || 0;
    }

    public setValue(variableId, value) {
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (typeof value === "number") {
                value = Math.floor(value);
            }
            this._data[variableId] = value;
            this.onChange();
        }
    }

    public onChange() {
        $gameMap.requestRefresh();
    }

}
