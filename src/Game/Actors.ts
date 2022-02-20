import { Game_Actor } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Game_Actors
 * 
 * The wrapper class for an actor array.
*/
export class Game_Actors {
    _data: any[];
    constructor(...args:any[]) {
        this.initialize(...arguments);
    }

    public initialize(...args) {
        this._data = [];
    }

    public actor(actorId) {
        if ($dataActors[actorId]) {
            if (!this._data[actorId]) {
                this._data[actorId] = new Game_Actor(actorId);
            }
            return this._data[actorId];
        }
        return null;
    }
}
