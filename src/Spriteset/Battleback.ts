import { BattleManager ,ImageManager} from "../Manager/index.js";
import { Graphics, TilingSprite } from "../Core/index.js";

//-----------------------------------------------------------------------------
/**
 * Sprite_Battleback
 * 
 * The sprite for displaying a background image in battle.
*/
export class Sprite_Battleback extends TilingSprite {
    constructor(...args: [number]) {
        super();
        this.initialize(...args);
    }


    public initialize(type) {
        TilingSprite.prototype.initialize.call(this);
        if (type === 0) {
            this.bitmap = this.battleback1Bitmap();
        } else {
            this.bitmap = this.battleback2Bitmap();
        }
    };

    public adjustPosition() {
        this.width = Math.floor((1000 * Graphics.width) / 816);
        this.height = Math.floor((740 * Graphics.height) / 624);
        this.x = (Graphics.width - this.width) / 2;
        if (window.$gameSystem.isSideView()) {
            this.y = Graphics.height - this.height;
        } else {
            this.y = 0;
        }
        const ratioX = this.width / this.bitmap.width;
        const ratioY = this.height / this.bitmap.height;
        const scale = Math.max(ratioX, ratioY, 1.0);
        this.scale.x = scale;
        this.scale.y = scale;
    };

    public battleback1Bitmap() {
        return ImageManager.loadBattleback1(this.battleback1Name());
    };

    public battleback2Bitmap() {
        return ImageManager.loadBattleback2(this.battleback2Name());
    };

    public battleback1Name() {
        if (BattleManager.isBattleTest()) {
            return window.$dataSystem.battleback1Name;
        } else if (window.$gameMap.battleback1Name() !== null) {
            return window.$gameMap.battleback1Name();
        } else if (window.$gameMap.isOverworld()) {
            return this.overworldBattleback1Name();
        } else {
            return "";
        }
    };

    public battleback2Name() {
        if (BattleManager.isBattleTest()) {
            return window.$dataSystem.battleback2Name;
        } else if (window.$gameMap.battleback2Name() !== null) {
            return window.$gameMap.battleback2Name();
        } else if (window.$gameMap.isOverworld()) {
            return this.overworldBattleback2Name();
        } else {
            return "";
        }
    };

    public overworldBattleback1Name() {
        if (window.$gamePlayer.isInVehicle()) {
            return this.shipBattleback1Name();
        } else {
            return this.normalBattleback1Name();
        }
    };

    public overworldBattleback2Name() {
        if (window.$gamePlayer.isInVehicle()) {
            return this.shipBattleback2Name();
        } else {
            return this.normalBattleback2Name();
        }
    };

    public normalBattleback1Name() {
        return (
            this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name()
        );
    };

    public normalBattleback2Name() {
        return (
            this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name()
        );
    };

    public terrainBattleback1Name(type) {
        switch (type) {
            case 24:
            case 25:
                return "Wasteland";
            case 26:
            case 27:
                return "DirtField";
            case 32:
            case 33:
                return "Desert";
            case 34:
                return "Lava1";
            case 35:
                return "Lava2";
            case 40:
            case 41:
                return "Snowfield";
            case 42:
                return "Clouds";
            case 4:
            case 5:
                return "PoisonSwamp";
            default:
                return null;
        }
    };

    public terrainBattleback2Name(type) {
        switch (type) {
            case 20:
            case 21:
                return "Forest";
            case 22:
            case 30:
            case 38:
                return "Cliff";
            case 24:
            case 25:
            case 26:
            case 27:
                return "Wasteland";
            case 32:
            case 33:
                return "Desert";
            case 34:
            case 35:
                return "Lava";
            case 40:
            case 41:
                return "Snowfield";
            case 42:
                return "Clouds";
            case 4:
            case 5:
                return "PoisonSwamp";
        }
    };

    public defaultBattleback1Name() {
        return "Grassland";
    };

    public defaultBattleback2Name() {
        return "Grassland";
    };

    public shipBattleback1Name() {
        return "Ship";
    };

    public shipBattleback2Name() {
        return "Ship";
    };

    public autotileType(z) {
        return window.$gameMap.autotileType(window.$gamePlayer.x, window.$gamePlayer.y, z);
    };
}
