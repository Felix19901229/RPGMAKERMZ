import { Game_Follower } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Game_Followers
 * 
 * The wrapper class for a follower array.
*/
export class Game_Followers {
    _visible: boolean;
    _gathering: boolean;
    _data: Game_Follower[];
    constructor(...args: any[]) {
        this.initialize(...args);
    }

    public initialize(...args) {
        this._visible = $dataSystem.optFollowers;
        this._gathering = false;
        this._data = [];
        this.setup();
    }

    public setup() {
        this._data = [];
        for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
            this._data.push(new Game_Follower(i));
        }
    }

    public isVisible() {
        return this._visible;
    }

    public show() {
        this._visible = true;
    }

    public hide() {
        this._visible = false;
    }

    public data() {
        return this._data.clone();
    }

    public reverseData() {
        return this._data.clone().reverse();
    }

    public follower(index) {
        return this._data[index];
    }

    public refresh() {
        for (const follower of this._data) {
            follower.refresh();
        }
    }

    public update() {
        if (this.areGathering()) {
            if (!this.areMoving()) {
                this.updateMove();
            }
            if (this.areGathered()) {
                this._gathering = false;
            }
        }
        for (const follower of this._data) {
            follower.update();
        }
    }

    public updateMove() {
        for (let i = this._data.length - 1; i >= 0; i--) {
            const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
            this._data[i].chaseCharacter(precedingCharacter);
        }
    }

    public jumpAll() {
        if ($gamePlayer.isJumping()) {
            for (const follower of this._data) {
                const sx = $gamePlayer.deltaXFrom(follower.x);
                const sy = $gamePlayer.deltaYFrom(follower.y);
                follower.jump(sx, sy);
            }
        }
    }

    public synchronize(x, y, d) {
        for (const follower of this._data) {
            follower.locate(x, y);
            follower.setDirection(d);
        }
    }

    public gather() {
        this._gathering = true;
    }

    public areGathering() {
        return this._gathering;
    }

    public visibleFollowers() {
        return this._data.filter(follower => follower.isVisible());
    }

    public areMoving() {
        return this.visibleFollowers().some(follower => follower.isMoving());
    }

    public areGathered() {
        return this.visibleFollowers().every(follower => follower.isGathered());
    }

    public isSomeoneCollided(x, y) {
        return this.visibleFollowers().some(follower => follower.pos(x, y));
    }
}
