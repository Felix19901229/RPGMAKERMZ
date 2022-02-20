import { Graphics, Sprite, Tilemap, TilingSprite, Weather } from "../Core/index.js";
import { ImageManager } from "../Manager/index.js";
import { Spriteset_Base, Sprite_Balloon, Sprite_Character, Sprite_Destination } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Spriteset_Map
 * 
 * The set of sprites on the map screen.
*/
export class Spriteset_Map extends Spriteset_Base {
    _balloonSprites: Sprite_Balloon[];
    _characterSprites: Sprite_Character[];
    _parallax: TilingSprite;
    _tilemap: Tilemap;
    _tileset: Tileset;
    _shadowSprite: Sprite;
    _destinationSprite: Sprite_Destination;
    _weather: Weather;
    _parallaxName: string;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(...args) {
        Spriteset_Base.prototype.initialize.call(this);
        this._balloonSprites = [];
    };

    public destroy(options) {
        this.removeAllBalloons();
        Spriteset_Base.prototype.destroy.call(this, options);
    };

    public loadSystemImages() {
        Spriteset_Base.prototype.loadSystemImages.call(this);
        ImageManager.loadSystem("Balloon");
        ImageManager.loadSystem("Shadow1");
    };

    public createLowerLayer() {
        Spriteset_Base.prototype.createLowerLayer.call(this);
        this.createParallax();
        this.createTilemap();
        this.createCharacters();
        this.createShadow();
        this.createDestination();
        this.createWeather();
    };

    public update() {
        Spriteset_Base.prototype.update.call(this);
        this.updateTileset();
        this.updateParallax();
        this.updateTilemap();
        this.updateShadow();
        this.updateWeather();
        this.updateAnimations();
        this.updateBalloons();
    };

    public hideCharacters() {
        for (const sprite of this._characterSprites) {
            if (!sprite.isTile() && !sprite.isObjectCharacter()) {
                sprite.hide();
            }
        }
    };

    public createParallax() {
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._baseSprite.addChild(this._parallax);
    };

    public createTilemap() {
        const tilemap = new Tilemap();
        tilemap.tileWidth = $gameMap.tileWidth();
        tilemap.tileHeight = $gameMap.tileHeight();
        tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
        tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
        tilemap.verticalWrap = $gameMap.isLoopVertical();
        this._baseSprite.addChild(tilemap);
        this._effectsContainer = tilemap;
        this._tilemap = tilemap;
        this.loadTileset();
    };

    public loadTileset() {
        this._tileset = $gameMap.tileset();
        if (this._tileset) {
            const bitmaps = [];
            const tilesetNames = this._tileset.tilesetNames;
            for (const name of tilesetNames) {
                bitmaps.push(ImageManager.loadTileset(name));
            }
            this._tilemap.setBitmaps(bitmaps);
            this._tilemap.flags = $gameMap.tilesetFlags();
        }
    };

    public createCharacters() {
        this._characterSprites = [];
        for (const event of $gameMap.events()) {
            this._characterSprites.push(new Sprite_Character(event));
        }
        for (const vehicle of $gameMap.vehicles()) {
            this._characterSprites.push(new Sprite_Character(vehicle));
        }
        for (const follower of $gamePlayer.followers().reverseData()) {
            this._characterSprites.push(new Sprite_Character(follower));
        }
        this._characterSprites.push(new Sprite_Character($gamePlayer));
        for (const sprite of this._characterSprites) {
            this._tilemap.addChild(sprite);
        }
    };

    public createShadow() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow1");
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this._shadowSprite.z = 6;
        this._tilemap.addChild(this._shadowSprite);
    };

    public createDestination() {
        this._destinationSprite = new Sprite_Destination();
        this._destinationSprite.z = 9;
        this._tilemap.addChild(this._destinationSprite as unknown as PIXI.DisplayObject);
    };

    public createWeather() {
        this._weather = new Weather();
        this.addChild(this._weather);
    };

    public updateTileset() {
        if (this._tileset !== $gameMap.tileset()) {
            this.loadTileset();
        }
    };

    public updateParallax() {
        if (this._parallaxName !== $gameMap.parallaxName()) {
            this._parallaxName = $gameMap.parallaxName();
            this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        }
        if (this._parallax.bitmap) {
            this._parallax.origin.x = $gameMap.parallaxOx();
            this._parallax.origin.y = $gameMap.parallaxOy();
        }
    };

    public updateTilemap() {
        this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    };

    public updateShadow() {
        const airship = $gameMap.airship();
        this._shadowSprite.x = airship.shadowX();
        this._shadowSprite.y = airship.shadowY();
        this._shadowSprite.opacity = airship.shadowOpacity();
    };

    public updateWeather() {
        this._weather.type = $gameScreen.weatherType();
        this._weather.power = $gameScreen.weatherPower();
        this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    };

    public updateBalloons() {
        for (const sprite of this._balloonSprites) {
            if (!sprite.isPlaying()) {
                this.removeBalloon(sprite);
            }
        }
        this.processBalloonRequests();
    };

    public processBalloonRequests() {
        for (; ;) {
            const request = $gameTemp.retrieveBalloon();
            if (request) {
                this.createBalloon(request);
            } else {
                break;
            }
        }
    };

    public createBalloon(request) {
        const targetSprite = this.findTargetSprite(request.target);
        if (targetSprite) {
            const sprite = new Sprite_Balloon();
            sprite.targetObject = request.target;
            sprite.setup(targetSprite, request.balloonId);
            this._effectsContainer.addChild(sprite);
            this._balloonSprites.push(sprite);
        }
    };

    public removeBalloon(sprite) {
        this._balloonSprites.remove(sprite);
        this._effectsContainer.removeChild(sprite);
        if (sprite.targetObject.endBalloon) {
            sprite.targetObject.endBalloon();
        }
        sprite.destroy();
    };

    public removeAllBalloons() {
        for (const sprite of this._balloonSprites) {
            this.removeBalloon(sprite);
        }
    };

    public findTargetSprite(target) {
        return this._characterSprites.find(sprite => sprite.checkCharacter(target));
    };

    public animationBaseDelay() {
        return 0;
    };
}
