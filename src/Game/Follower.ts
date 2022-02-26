import { Game_Character } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Game_Follower
 * 
 * The game object class for a follower. A follower is an allied character,
 * other than the front character, displayed in the party.
*/
export class Game_Follower extends Game_Character {
    _memberIndex: number;
    constructor(...args: [number]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(memberIndex:number) {
        Game_Character.prototype.initialize.call(this);
        this._memberIndex = memberIndex;
        this.setTransparent(window.$dataSystem.optTransparent);
        this.setThrough(true);
    }

    public refresh() {
        const characterName = this.isVisible() ? this.actor().characterName() : "";
        const characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
        this.setImage(characterName, characterIndex);
    }

    public actor() {
        return window.$gameParty.battleMembers()[this._memberIndex];
    }

    public isVisible() {
        return this.actor() && window.$gamePlayer.followers().isVisible();
    }

    public isGathered() {
        return !this.isMoving() && this.pos(window.$gamePlayer.x, window.$gamePlayer.y);
    }

    public update() {
        Game_Character.prototype.update.call(this);
        this.setMoveSpeed(window.$gamePlayer.realMoveSpeed());
        this.setOpacity(window.$gamePlayer.opacity());
        this.setBlendMode(window.$gamePlayer.blendMode());
        this.setWalkAnime(window.$gamePlayer.hasWalkAnime());
        this.setStepAnime(window.$gamePlayer.hasStepAnime());
        this.setDirectionFix(window.$gamePlayer.isDirectionFixed());
        this.setTransparent(window.$gamePlayer.isTransparent());
    }

    public chaseCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (sx !== 0 && sy !== 0) {
            this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
        } else if (sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
        this.setMoveSpeed(window.$gamePlayer.realMoveSpeed());
    }
}
