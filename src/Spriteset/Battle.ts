import { Graphics, Sprite } from "../Core/index.js";
import { ImageManager, SceneManager } from "../Manager/index.js";
import { Spriteset_Base, Sprite_Actor, Sprite_Battleback, Sprite_Enemy } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Spriteset_Battle
 * 
 * The set of sprites on the battle screen.
*/
export class Spriteset_Battle extends Spriteset_Base {
    _battlebackLocated: boolean;
    _backgroundFilter: any;
    _backgroundSprite: any;
    _back1Sprite: any;
    _back2Sprite: any;
    _battleField: any;
    _enemySprites: any[];
    _actorSprites: any[];
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Spriteset_Base.prototype.initialize.call(this);
        this._battlebackLocated = false;
    };

    public loadSystemImages() {
        Spriteset_Base.prototype.loadSystemImages.call(this);
        ImageManager.loadSystem("Shadow2");
        ImageManager.loadSystem("Weapons1");
        ImageManager.loadSystem("Weapons2");
        ImageManager.loadSystem("Weapons3");
    };

    public createLowerLayer() {
        Spriteset_Base.prototype.createLowerLayer.call(this);
        this.createBackground();
        this.createBattleback();
        this.createBattleField();
        this.createEnemies();
        this.createActors();
    };

    public createBackground() {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this._baseSprite.addChild(this._backgroundSprite);
    };

    public createBattleback() {
        this._back1Sprite = new Sprite_Battleback(0);
        this._back2Sprite = new Sprite_Battleback(1);
        this._baseSprite.addChild(this._back1Sprite);
        this._baseSprite.addChild(this._back2Sprite);
    };

    public createBattleField() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._battleField = new Sprite();
        this._battleField.setFrame(0, 0, width, height);
        this._battleField.x = x;
        this._battleField.y = y - this.battleFieldOffsetY();
        this._baseSprite.addChild(this._battleField);
        this._effectsContainer = this._battleField;
    };

    public battleFieldOffsetY() {
        return 24;
    };

    public update() {
        Spriteset_Base.prototype.update.call(this);
        this.updateActors();
        this.updateBattleback();
        this.updateAnimations();
    };

    public updateBattleback() {
        if (!this._battlebackLocated) {
            this._back1Sprite.adjustPosition();
            this._back2Sprite.adjustPosition();
            this._battlebackLocated = true;
        }
    };

    public createEnemies() {
        const enemies = window.$gameTroop.members();
        const sprites = [];
        for (const enemy of enemies) {
            sprites.push(new Sprite_Enemy(enemy));
        }
        sprites.sort(this.compareEnemySprite.bind(this));
        for (const sprite of sprites) {
            this._battleField.addChild(sprite);
        }
        this._enemySprites = sprites;
    };

    public compareEnemySprite(a, b) {
        if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return b.spriteId - a.spriteId;
        }
    };

    public createActors() {
        this._actorSprites = [];
        if (window.$gameSystem.isSideView()) {
            for (let i = 0; i < window.$gameParty.maxBattleMembers(); i++) {
                const sprite = new Sprite_Actor();
                this._actorSprites.push(sprite);
                this._battleField.addChild(sprite);
            }
        }
    };

    public updateActors() {
        const members = window.$gameParty.battleMembers();
        for (let i = 0; i < this._actorSprites.length; i++) {
            this._actorSprites[i].setBattler(members[i]);
        }
    };

    public findTargetSprite(target) {
        return this.battlerSprites().find(sprite => sprite.checkBattler(target));
    };

    public battlerSprites() {
        return this._enemySprites.concat(this._actorSprites);
    };

    public isEffecting() {
        return this.battlerSprites().some(sprite => sprite.isEffecting());
    };

    public isAnyoneMoving() {
        return this.battlerSprites().some(sprite => sprite.isMoving());
    };

    public isBusy() {
        return this.isAnimationPlaying() || this.isAnyoneMoving();
    };
}
