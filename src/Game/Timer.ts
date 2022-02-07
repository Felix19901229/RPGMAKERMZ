import { BattleManager } from "../Manager/index.js";
//-----------------------------------------------------------------------------
/**
 * Game_Timer
 * 
 * The game object class for the timer.
*/
export class Game_Timer {
    _frames: number;
    _working: boolean;
    constructor() {
        this.initialize();
    }

    public initialize() {
        this._frames = 0;
        this._working = false;
    };

    public update(sceneActive: boolean) {
        if (sceneActive && this._working && this._frames > 0) {
            this._frames--;
            if (this._frames === 0) {
                this.onExpire();
            }
        }
    };

    public start(count: number) {
        this._frames = count;
        this._working = true;
    };

    public stop() {
        this._working = false;
    };

    public isWorking() {
        return this._working;
    };

    public seconds() {
        return Math.floor(this._frames / 60);
    };

    public onExpire() {
        BattleManager.abort();
    };
}
