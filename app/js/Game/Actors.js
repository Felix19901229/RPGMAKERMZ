import { Game_Actor } from "./index.js";
export class Game_Actors {
    _data;
    constructor(...args) {
        this.initialize(...arguments);
    }
    initialize(...args) {
        this._data = [];
    }
    actor(actorId) {
        if ($dataActors[actorId]) {
            if (!this._data[actorId]) {
                this._data[actorId] = new Game_Actor(actorId);
            }
            return this._data[actorId];
        }
        return null;
    }
}
