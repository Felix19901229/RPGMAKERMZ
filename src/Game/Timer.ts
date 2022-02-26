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
    constructor(...args: any[]) {
        this.initialize(...args);
    }

    public initialize(...args) {
        this._frames = 0;
        this._working = false;
    }

    public update(sceneActive) {
        if (sceneActive && this._working && this._frames > 0) {
            this._frames--;
            if (this._frames === 0) {
                this.onExpire();
            }
        }
    }

    public start(count) {
        this._frames = count;
        this._working = true;
    }

    public stop() {
        this._working = false;
    }

    public isWorking() {
        return this._working;
    }

    public seconds() {
        return Math.floor(this._frames / 60);
    }

    public frames() {
        return this._frames;
    }
    
    public onExpire() {
        BattleManager.abort();
    }
}
