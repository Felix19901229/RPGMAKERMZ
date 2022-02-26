
//-----------------------------------------------------------------------------
/**
 * Game_SelfSwitches
 * 
 * The game object class for self switches.
*/
export class Game_SelfSwitches {
    _data: {[key:string]:boolean}
    constructor(...args: any[]) {
        this.initialize(...args);
    }

    public initialize(...args) {
        this.clear();
    }

    public clear() {
        this._data = {}
    }

    public value(key) {
        return !!this._data[key];
    }

    public setValue(key, value) {
        if (value) {
            this._data[key] = true;
        } else {
            delete this._data[key];
        }
        this.onChange();
    }

    public onChange() {
        window.$gameMap.requestRefresh();
    }
}
