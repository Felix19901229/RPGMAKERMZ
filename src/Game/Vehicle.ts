import { AudioManager } from "../Manager/index.js";
import { Game_Character } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Game_Vehicle
 * 
 * The game object class for a vehicle.
*/
export class Game_Vehicle extends Game_Character {
    _type: "" | "boat" | "ship" | "airship";
    _mapId: number;
    _altitude: number;
    _driving: boolean;
    _bgm: any;
    constructor(...args: [("" | "boat" | "ship" | "airship")]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(type:"" | "boat" | "ship" | "airship") {
        Game_Character.prototype.initialize.call(this);
        this._type = type;
        this.resetDirection();
        this.initMoveSpeed();
        this.loadSystemSettings();
    }

    public initMembers() {
        Game_Character.prototype.initMembers.call(this);
        this._type = "";
        this._mapId = 0;
        this._altitude = 0;
        this._driving = false;
        this._bgm = null;
    }

    public isBoat() {
        return this._type === "boat";
    }

    public isShip() {
        return this._type === "ship";
    }

    public isAirship() {
        return this._type === "airship";
    }

    public resetDirection() {
        this.setDirection(4);
    }

    public initMoveSpeed() {
        if (this.isBoat()) {
            this.setMoveSpeed(4);
        } else if (this.isShip()) {
            this.setMoveSpeed(5);
        } else if (this.isAirship()) {
            this.setMoveSpeed(6);
        }
    }

    public vehicle() {
        if (this.isBoat()) {
            return window.$dataSystem.boat;
        } else if (this.isShip()) {
            return window.$dataSystem.ship;
        } else if (this.isAirship()) {
            return window.$dataSystem.airship;
        } else {
            return null;
        }
    }

    public loadSystemSettings() {
        const vehicle = this.vehicle();
        this._mapId = vehicle.startMapId;
        this.setPosition(vehicle.startX, vehicle.startY);
        this.setImage(vehicle.characterName, vehicle.characterIndex);
    }

    public refresh() {
        if (this._driving) {
            this._mapId = window.$gameMap.mapId();
            this.syncWithPlayer();
        } else if (this._mapId === window.$gameMap.mapId()) {
            this.locate(this.x, this.y);
        }
        if (this.isAirship()) {
            this.setPriorityType(this._driving ? 2 : 0);
        } else {
            this.setPriorityType(1);
        }
        this.setWalkAnime(this._driving);
        this.setStepAnime(this._driving);
        this.setTransparent(this._mapId !== window.$gameMap.mapId());
    }

    public setLocation(mapId, x, y) {
        this._mapId = mapId;
        this.setPosition(x, y);
        this.refresh();
    }

    public pos(x, y) {
        if (this._mapId === window.$gameMap.mapId()) {
            return Game_Character.prototype.pos.call(this, x, y);
        } else {
            return false;
        }
    }

    public isMapPassable(x, y, d) {
        const x2 = window.$gameMap.roundXWithDirection(x, d);
        const y2 = window.$gameMap.roundYWithDirection(y, d);
        if (this.isBoat()) {
            return window.$gameMap.isBoatPassable(x2, y2);
        } else if (this.isShip()) {
            return window.$gameMap.isShipPassable(x2, y2);
        } else if (this.isAirship()) {
            return true;
        } else {
            return false;
        }
    }

    public getOn() {
        this._driving = true;
        this.setWalkAnime(true);
        this.setStepAnime(true);
        window.$gameSystem.saveWalkingBgm();
        this.playBgm();
    }

    public getOff() {
        this._driving = false;
        this.setWalkAnime(false);
        this.setStepAnime(false);
        this.resetDirection();
        window.$gameSystem.replayWalkingBgm();
    }

    public setBgm(bgm) {
        this._bgm = bgm;
    }

    public playBgm() {
        AudioManager.playBgm(this._bgm || this.vehicle().bgm);
    }

    public syncWithPlayer() {
        this.copyPosition(window.$gamePlayer);
        this.refreshBushDepth();
    }

    public screenY() {
        return Game_Character.prototype.screenY.call(this) - this._altitude;
    }

    public shadowX() {
        return this.screenX();
    }

    public shadowY() {
        return this.screenY() + this._altitude;
    }

    public shadowOpacity() {
        return (255 * this._altitude) / this.maxAltitude();
    }

    public canMove() {
        if (this.isAirship()) {
            return this.isHighest();
        } else {
            return true;
        }
    }

    public update() {
        Game_Character.prototype.update.call(this);
        if (this.isAirship()) {
            this.updateAirship();
        }
    }

    public updateAirship() {
        this.updateAirshipAltitude();
        this.setStepAnime(this.isHighest());
        this.setPriorityType(this.isLowest() ? 0 : 2);
    }

    public updateAirshipAltitude() {
        if (this._driving && !this.isHighest()) {
            this._altitude++;
        }
        if (!this._driving && !this.isLowest()) {
            this._altitude--;
        }
    }

    public maxAltitude() {
        return 48;
    }

    public isLowest() {
        return this._altitude <= 0;
    }

    public isHighest() {
        return this._altitude >= this.maxAltitude();
    }

    public isTakeoffOk() {
        return window.$gamePlayer.areFollowersGathered();
    }

    public isLandOk(x, y, d) {
        if (this.isAirship()) {
            if (!window.$gameMap.isAirshipLandOk(x, y)) {
                return false;
            }
            if (window.$gameMap.eventsXy(x, y).length > 0) {
                return false;
            }
        } else {
            const x2 = window.$gameMap.roundXWithDirection(x, d);
            const y2 = window.$gameMap.roundYWithDirection(y, d);
            if (!window.$gameMap.isValid(x2, y2)) {
                return false;
            }
            if (!window.$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
                return false;
            }
            if (this.isCollidedWithCharacters(x2, y2)) {
                return false;
            }
        }
        return true;
    }
}
